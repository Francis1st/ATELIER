import JSZip from "jszip";
import { z } from "zod";
import { CATEGORIES, SEASONS } from "@/domain/types";
import type { StoredImage, WardrobeItem } from "@/domain/types";
import { openDb } from "@/db";
import {
  mergeData,
  normalizeImportedItem,
  replaceAllData,
} from "@/services/wardrobe/repository";

/** v3 adds AI curated covers; v1/v2 ZIPs remain importable. */
export const SCHEMA_VERSION = 3;
export const FORMAT_ID = "atelier-wardrobe";
export const MAX_ZIP_BYTES = 40 * 1024 * 1024;
export const MAX_IMAGE_ENTRY_BYTES = 10 * 1024 * 1024;

const manifestItemSchema = z.object({
  id: z.string().uuid().or(z.string().min(8).max(80)),
  name: z.string().min(1).max(120),
  brand: z.string().max(80).optional(),
  model: z.string().max(80).optional(),
  category: z.enum(CATEGORIES),
  subcategory: z.string().max(80).optional(),
  colors: z.array(z.string().max(40)).max(8).default([]),
  seasons: z.array(z.enum(SEASONS)).max(4).default([]),
  material: z.string().max(80).optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().nonnegative().optional(),
  currency: z.string().max(3).optional(),
  notes: z.string().max(2000).optional(),
  isFavorite: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  originalImageId: z.string().optional(),
  curatedImageId: z.string().optional(),
  aiCuratedImageId: z.string().optional(),
  coverImageId: z.string().optional(),
  activeCoverType: z.enum(["original", "curated", "ai"]).optional(),
  productMatchNotes: z.string().max(2000).optional(),
});

const sourceMetaSchema = z
  .object({
    sourceType: z.enum(["user_photo", "demo_asset", "licensed_catalog"]),
    sourceUrl: z.string().max(2000).optional(),
    licenseStatus: z.enum([
      "user_owned",
      "unknown",
      "link_only",
      "licensed_for_display",
      "forbidden",
    ]),
    attribution: z.string().max(500).optional(),
    licenseReference: z.string().max(500).optional(),
    userConfirmedAt: z.string().optional(),
  })
  .optional();

const manifestImageSchema = z.object({
  id: z.string().min(8).max(80),
  itemId: z.string().min(8).max(80),
  role: z.enum(["original", "cover", "ai_curated"]),
  source: z.enum(["user_photo", "demo_asset", "licensed_catalog"]),
  mimeType: z.string().min(3).max(80),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  filename: z.string().min(1).max(180),
  createdAt: z.string(),
  sourceMeta: sourceMetaSchema,
  focalY: z.number().min(0).max(1).optional(),
  rotation: z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)]).optional(),
  generatedBy: z.string().max(200).optional(),
  generationVersion: z.string().max(80).optional(),
});

const manifestSchema = z.object({
  format: z.literal(FORMAT_ID),
  schemaVersion: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  exportedAt: z.string(),
  items: z.array(manifestItemSchema),
  images: z.array(manifestImageSchema),
});

export type ImportMode = "merge" | "replace";

function safeZipPath(filename: string): string {
  const base = filename.replace(/\\/g, "/").split("/").pop() ?? "";
  if (!base || base.includes("..") || base.startsWith(".")) {
    throw new Error(`Unsafe image filename: ${filename}`);
  }
  return `images/${base}`;
}

function mayExportImageBytes(image: StoredImage): boolean {
  if (image.source === "licensed_catalog") return false;
  const status = image.sourceMeta?.licenseStatus;
  if (status === "forbidden" || status === "link_only" || status === "unknown") {
    // Unknown remote rights must not ship inside a user backup.
    if (image.source !== "user_photo" && image.source !== "demo_asset") {
      return false;
    }
  }
  if (status === "forbidden" || status === "link_only") return false;
  return true;
}

export async function exportWardrobeZip(): Promise<Blob> {
  const db = await openDb();
  const items = (await db.items.toArray()).map(normalizeImportedItem);
  const images = await db.images.toArray();
  const zip = new JSZip();

  const exportable = images.filter(mayExportImageBytes);
  const skippedLicensed = images.length - exportable.length;

  const manifest = {
    format: FORMAT_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    items,
    images: exportable.map((image) => {
      const { blob: _ignored, ...meta } = image;
      void _ignored;
      return meta;
    }),
    skippedNonExportableImages: skippedLicensed || undefined,
  };

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  const folder = zip.folder("images");
  if (!folder) throw new Error("Could not create export archive.");

  for (const image of exportable) {
    const path = safeZipPath(image.filename);
    const name = path.replace(/^images\//, "");
    folder.file(name, image.blob);
  }

  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}

export async function importWardrobeZip(
  file: File,
  mode: ImportMode,
): Promise<{ itemCount: number; imageCount: number; added?: number; replaced?: number }> {
  if (file.size > MAX_ZIP_BYTES) {
    throw new Error("This ZIP is too large (40 MB limit).");
  }

  const zip = await JSZip.loadAsync(file);
  const manifestFile = zip.file("manifest.json");
  if (!manifestFile) throw new Error("manifest.json is missing from this ZIP.");

  const raw = await manifestFile.async("string");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("manifest.json is not valid JSON.");
  }

  const manifest = manifestSchema.parse(parsed);
  if (manifest.items.length === 0) {
    throw new Error("This export contains no wardrobe items.");
  }

  const imageEntries = Object.keys(zip.files).filter(
    (p) => p.startsWith("images/") && !zip.files[p].dir,
  );
  for (const path of imageEntries) {
    if (path.includes("..") || path.split("/").length !== 2) {
      throw new Error("ZIP contains an unsafe image path.");
    }
  }

  const storedImages: StoredImage[] = [];
  for (const meta of manifest.images) {
    const path = safeZipPath(meta.filename);
    const entry = zip.file(path);
    if (!entry) {
      // Missing studio/AI can fall back to original on read — skip soft.
      if (meta.role === "cover" || meta.role === "ai_curated") continue;
      throw new Error(`Missing image file: ${meta.filename}`);
    }
    const blob = await entry.async("blob");
    if (blob.size > MAX_IMAGE_ENTRY_BYTES) {
      throw new Error(`Image too large in archive: ${meta.filename}`);
    }
    if (!meta.mimeType.startsWith("image/")) {
      throw new Error(`Unsupported image type: ${meta.mimeType}`);
    }
    storedImages.push({
      ...meta,
      blob: new Blob([blob], { type: meta.mimeType }),
    });
  }

  // Ensure every item still has at least an original (or any) image after soft skips.
  for (const item of manifest.items) {
    const hasAny = storedImages.some((img) => img.itemId === item.id);
    if (!hasAny) {
      throw new Error(`No recoverable photos for “${item.name}”.`);
    }
  }

  const items = manifest.items.map((item) =>
    normalizeImportedItem(item as WardrobeItem),
  );

  if (mode === "replace") {
    await replaceAllData(items, storedImages);
    return { itemCount: items.length, imageCount: storedImages.length };
  }

  const result = await mergeData(items, storedImages);
  return {
    itemCount: items.length,
    imageCount: storedImages.length,
    ...result,
  };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
