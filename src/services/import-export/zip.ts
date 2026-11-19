import JSZip from "jszip";
import { z } from "zod";
import { CATEGORIES, SEASONS } from "@/domain/types";
import type { StoredImage, WardrobeItem } from "@/domain/types";
import { openDb } from "@/db";
import { mergeData, replaceAllData } from "@/services/wardrobe/repository";

export const SCHEMA_VERSION = 1;
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
  coverImageId: z.string().optional(),
});

const manifestImageSchema = z.object({
  id: z.string().min(8).max(80),
  itemId: z.string().min(8).max(80),
  role: z.enum(["original", "cover"]),
  source: z.enum(["user_photo", "demo_asset"]),
  mimeType: z.string().min(3).max(80),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  filename: z.string().min(1).max(180),
  createdAt: z.string(),
});

const manifestSchema = z.object({
  format: z.literal(FORMAT_ID),
  schemaVersion: z.literal(SCHEMA_VERSION),
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

export async function exportWardrobeZip(): Promise<Blob> {
  const db = await openDb();
  const items = await db.items.toArray();
  const images = await db.images.toArray();
  const zip = new JSZip();

  const manifest = {
    format: FORMAT_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    items,
    images: images.map((image) => {
      const { blob: _ignored, ...meta } = image;
      void _ignored;
      return meta;
    }),
  };

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  const folder = zip.folder("images");
  if (!folder) throw new Error("Could not create export archive.");

  for (const image of images) {
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
  if (!file.name.toLowerCase().endsWith(".zip") && file.type !== "application/zip") {
    // still allow if browser omits type, but prefer .zip names
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

  const items = manifest.items as WardrobeItem[];

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
