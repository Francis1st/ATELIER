import { openDb, clearWardrobeData } from "@/db";
import type { WardrobeItemInput } from "@/domain/schema";
import type {
  ActiveCoverType,
  StoredImage,
  WardrobeItem,
} from "@/domain/types";
import { resolveActiveCoverId } from "@/domain/types";
import { createId } from "@/lib/id";
import {
  extensionForMime,
  processImageFile,
  type CoverDraftOptions,
  type ProcessedImage,
} from "@/services/images/process";

function nowIso() {
  return new Date().toISOString();
}

function cleanOptional(value?: string): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

export async function listItems(): Promise<WardrobeItem[]> {
  const db = await openDb();
  return db.items.orderBy("createdAt").reverse().toArray();
}

export async function getItem(id: string): Promise<WardrobeItem | undefined> {
  const db = await openDb();
  return db.items.get(id);
}

export async function getImage(id: string): Promise<StoredImage | undefined> {
  const db = await openDb();
  return db.images.get(id);
}

export async function getImagesForItem(itemId: string): Promise<StoredImage[]> {
  const db = await openDb();
  return db.images.where("itemId").equals(itemId).toArray();
}

export type AiCoverAttachment = {
  blob: Blob;
  providerId: string;
  generationVersion: string;
  model?: string;
};

export type CreateItemImageOptions = CoverDraftOptions & {
  /** Gallery prefers Original / Studio Clean / AI Curated. */
  activeCoverType?: ActiveCoverType;
  /** Optional AI result accepted by the user before save. */
  aiCover?: AiCoverAttachment;
};

function resolveCoverImageId(
  activeCoverType: ActiveCoverType,
  ids: {
    originalImageId?: string;
    curatedImageId?: string;
    aiCuratedImageId?: string;
  },
): string | undefined {
  if (activeCoverType === "original") return ids.originalImageId;
  if (activeCoverType === "ai") {
    return (
      ids.aiCuratedImageId ??
      ids.curatedImageId ??
      ids.originalImageId
    );
  }
  return ids.curatedImageId ?? ids.originalImageId;
}

export async function createItem(
  input: WardrobeItemInput,
  file: File,
  imageOptions: CreateItemImageOptions = {},
): Promise<WardrobeItem> {
  const processed = await processImageFile(file, imageOptions);
  const db = await openDb();
  const id = createId();
  const originalImageId = createId();
  const curatedImageId = createId();
  const aiCuratedImageId = imageOptions.aiCover ? createId() : undefined;
  const activeCoverType: ActiveCoverType =
    imageOptions.activeCoverType ??
    (aiCuratedImageId ? "ai" : "curated");
  const coverImageId = resolveCoverImageId(activeCoverType, {
    originalImageId,
    curatedImageId,
    aiCuratedImageId,
  });
  const stamp = nowIso();

  const item: WardrobeItem = {
    id,
    name: input.name.trim(),
    brand: cleanOptional(input.brand),
    model: cleanOptional(input.model),
    category: input.category,
    subcategory: cleanOptional(input.subcategory),
    colors: input.colors,
    seasons: input.seasons,
    material: cleanOptional(input.material),
    purchaseDate: cleanOptional(input.purchaseDate),
    purchasePrice: input.purchasePrice,
    currency: cleanOptional(input.currency)?.toUpperCase(),
    notes: cleanOptional(input.notes),
    isFavorite: input.isFavorite,
    sortOrder: Date.now(),
    createdAt: stamp,
    updatedAt: stamp,
    originalImageId,
    curatedImageId,
    aiCuratedImageId,
    coverImageId,
    activeCoverType,
  };

  const images = buildImageRecords(
    id,
    originalImageId,
    curatedImageId,
    processed,
  );
  if (imageOptions.aiCover && aiCuratedImageId) {
    images.push(
      await buildAiImageRecord(
        id,
        aiCuratedImageId,
        imageOptions.aiCover,
        stamp,
      ),
    );
  }

  await db.transaction("rw", db.items, db.images, async () => {
    await db.items.add(item);
    await db.images.bulkAdd(images);
  });

  return item;
}

export async function updateItem(
  id: string,
  input: WardrobeItemInput,
  file?: File | null,
  imageOptions: CreateItemImageOptions = {},
): Promise<WardrobeItem> {
  const db = await openDb();
  const existing = await db.items.get(id);
  if (!existing) throw new Error("This piece was not found.");

  let originalImageId = existing.originalImageId;
  let curatedImageId = existing.curatedImageId ?? existing.coverImageId;
  let aiCuratedImageId = existing.aiCuratedImageId;
  let coverImageId = existing.coverImageId;
  let activeCoverType: ActiveCoverType =
    imageOptions.activeCoverType ??
    existing.activeCoverType ??
    (curatedImageId ? "curated" : "original");
  let newImages: StoredImage[] | null = null;
  let removeImageIds: string[] = [];

  if (file) {
    const processed = await processImageFile(file, imageOptions);
    originalImageId = createId();
    curatedImageId = createId();
    aiCuratedImageId = imageOptions.aiCover ? createId() : undefined;
    activeCoverType =
      imageOptions.activeCoverType ??
      (aiCuratedImageId ? "ai" : "curated");
    coverImageId = resolveCoverImageId(activeCoverType, {
      originalImageId,
      curatedImageId,
      aiCuratedImageId,
    });
    newImages = buildImageRecords(
      id,
      originalImageId!,
      curatedImageId!,
      processed,
    );
    if (imageOptions.aiCover && aiCuratedImageId) {
      newImages.push(
        await buildAiImageRecord(
          id,
          aiCuratedImageId,
          imageOptions.aiCover,
          nowIso(),
        ),
      );
    }
    const old = await db.images.where("itemId").equals(id).toArray();
    removeImageIds = old.map((img) => img.id);
  } else {
    if (imageOptions.aiCover) {
      const stamp = nowIso();
      const nextAiId = createId();
      const aiRecord = await buildAiImageRecord(
        id,
        nextAiId,
        imageOptions.aiCover,
        stamp,
      );
      if (aiCuratedImageId) removeImageIds.push(aiCuratedImageId);
      aiCuratedImageId = nextAiId;
      newImages = [aiRecord];
      if (!imageOptions.activeCoverType) activeCoverType = "ai";
    }
    if (imageOptions.activeCoverType) {
      activeCoverType = imageOptions.activeCoverType;
    }
    coverImageId = resolveCoverImageId(activeCoverType, {
      originalImageId,
      curatedImageId,
      aiCuratedImageId,
    });
  }

  const updated: WardrobeItem = {
    ...existing,
    name: input.name.trim(),
    brand: cleanOptional(input.brand),
    model: cleanOptional(input.model),
    category: input.category,
    subcategory: cleanOptional(input.subcategory),
    colors: input.colors,
    seasons: input.seasons,
    material: cleanOptional(input.material),
    purchaseDate: cleanOptional(input.purchaseDate),
    purchasePrice: input.purchasePrice,
    currency: cleanOptional(input.currency)?.toUpperCase(),
    notes: cleanOptional(input.notes),
    isFavorite: input.isFavorite,
    updatedAt: nowIso(),
    originalImageId,
    curatedImageId,
    aiCuratedImageId,
    coverImageId,
    activeCoverType,
  };

  await db.transaction("rw", db.items, db.images, async () => {
    await db.items.put(updated);
    if (removeImageIds.length) await db.images.bulkDelete(removeImageIds);
    if (newImages) await db.images.bulkAdd(newImages);
  });

  return updated;
}

/** Switch gallery cover without touching archival original bytes. */
export async function setActiveCover(
  id: string,
  activeCoverType: ActiveCoverType,
): Promise<WardrobeItem> {
  const db = await openDb();
  const existing = await db.items.get(id);
  if (!existing) throw new Error("This piece was not found.");

  const coverImageId = resolveCoverImageId(activeCoverType, {
    originalImageId: existing.originalImageId,
    curatedImageId: existing.curatedImageId ?? existing.coverImageId,
    aiCuratedImageId: existing.aiCuratedImageId,
  });

  if (!coverImageId) {
    throw new Error("No photo is available for this cover choice.");
  }
  if (activeCoverType === "ai" && !existing.aiCuratedImageId) {
    throw new Error("Generate an AI Curated Cover before selecting it.");
  }

  const updated: WardrobeItem = {
    ...existing,
    activeCoverType,
    coverImageId,
    updatedAt: nowIso(),
  };
  await db.items.put(updated);
  return updated;
}

export async function deleteItem(id: string): Promise<void> {
  const db = await openDb();
  await db.transaction("rw", db.items, db.images, async () => {
    await db.items.delete(id);
    await db.images.where("itemId").equals(id).delete();
  });
}

export async function toggleFavorite(id: string): Promise<WardrobeItem> {
  const db = await openDb();
  const item = await db.items.get(id);
  if (!item) throw new Error("This piece was not found.");
  const updated = {
    ...item,
    isFavorite: !item.isFavorite,
    updatedAt: nowIso(),
  };
  await db.items.put(updated);
  return updated;
}

export async function replaceAllData(
  items: WardrobeItem[],
  images: StoredImage[],
): Promise<void> {
  const db = await openDb();
  await db.transaction("rw", db.items, db.images, async () => {
    await db.items.clear();
    await db.images.clear();
    if (items.length) await db.items.bulkAdd(items);
    if (images.length) await db.images.bulkAdd(images);
  });
}

export async function mergeData(
  items: WardrobeItem[],
  images: StoredImage[],
): Promise<{ added: number; replaced: number }> {
  const db = await openDb();
  let added = 0;
  let replaced = 0;

  await db.transaction("rw", db.items, db.images, async () => {
    for (const item of items) {
      const existing = await db.items.get(item.id);
      if (existing) {
        replaced += 1;
        await db.images.where("itemId").equals(item.id).delete();
      } else {
        added += 1;
      }
      await db.items.put(normalizeImportedItem(item));
    }
    if (images.length) await db.images.bulkPut(images);
  });

  return { added, replaced };
}

export { clearWardrobeData, resolveActiveCoverId };

/** Backfill curatedImageId / activeCoverType for schema v1–v2 rows. */
export function normalizeImportedItem(item: WardrobeItem): WardrobeItem {
  const curatedImageId = item.curatedImageId ?? item.coverImageId;
  let activeCoverType: ActiveCoverType =
    item.activeCoverType ??
    (curatedImageId && curatedImageId !== item.originalImageId
      ? "curated"
      : item.originalImageId
        ? "original"
        : "curated");
  if (activeCoverType === "ai" && !item.aiCuratedImageId) {
    activeCoverType = curatedImageId ? "curated" : "original";
  }
  return {
    ...item,
    curatedImageId,
    aiCuratedImageId: item.aiCuratedImageId,
    activeCoverType,
    coverImageId:
      item.coverImageId ??
      resolveCoverImageId(activeCoverType, {
        originalImageId: item.originalImageId,
        curatedImageId,
        aiCuratedImageId: item.aiCuratedImageId,
      }),
  };
}

function buildImageRecords(
  itemId: string,
  originalImageId: string,
  curatedImageId: string,
  processed: ProcessedImage,
): StoredImage[] {
  const stamp = nowIso();
  const ext = extensionForMime(processed.mimeType);
  const curatedMime =
    processed.curatedBlob.type || processed.mimeType;
  return [
    {
      id: originalImageId,
      itemId,
      role: "original",
      source: "user_photo",
      mimeType: processed.mimeType,
      width: processed.width,
      height: processed.height,
      filename: `${originalImageId}.${ext}`,
      blob: processed.originalBlob,
      createdAt: stamp,
      sourceMeta: {
        sourceType: "user_photo",
        licenseStatus: "user_owned",
      },
    },
    {
      id: curatedImageId,
      itemId,
      role: "cover",
      source: "user_photo",
      mimeType: curatedMime,
      width: processed.curatedWidth,
      height: processed.curatedHeight,
      filename: `${curatedImageId}.${extensionForMime(curatedMime)}`,
      blob: processed.curatedBlob,
      createdAt: stamp,
      focalY: processed.focalY,
      rotation: processed.rotation,
      sourceMeta: {
        sourceType: "user_photo",
        licenseStatus: "user_owned",
      },
    },
  ];
}

async function buildAiImageRecord(
  itemId: string,
  imageId: string,
  ai: AiCoverAttachment,
  stamp: string,
): Promise<StoredImage> {
  const mime = ai.blob.type || "image/jpeg";
  let width = 1;
  let height = 1;
  try {
    const bmp = await createImageBitmap(ai.blob);
    width = bmp.width;
    height = bmp.height;
    bmp.close();
  } catch {
    // Dimensions stay placeholder if decode fails — blob still stored.
  }
  return {
    id: imageId,
    itemId,
    role: "ai_curated",
    source: "user_photo",
    mimeType: mime,
    width,
    height,
    filename: `${imageId}.${extensionForMime(mime)}`,
    blob: ai.blob,
    createdAt: stamp,
    generatedBy: ai.model
      ? `${ai.providerId}:${ai.model}`
      : ai.providerId,
    generationVersion: ai.generationVersion,
    sourceMeta: {
      sourceType: "user_photo",
      licenseStatus: "user_owned",
      attribution:
        "AI Curated Cover — generated presentation, not brand photography",
    },
  };
}
