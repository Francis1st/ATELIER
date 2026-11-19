import { openDb, clearWardrobeData } from "@/db";
import type { WardrobeItemInput } from "@/domain/schema";
import type { StoredImage, WardrobeItem } from "@/domain/types";
import { createId } from "@/lib/id";
import {
  extensionForMime,
  processImageFile,
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

export async function createItem(
  input: WardrobeItemInput,
  file: File,
): Promise<WardrobeItem> {
  const processed = await processImageFile(file);
  const db = await openDb();
  const id = createId();
  const originalImageId = createId();
  const coverImageId = createId();
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
    coverImageId,
  };

  const images = buildImageRecords(id, originalImageId, coverImageId, processed);

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
): Promise<WardrobeItem> {
  const db = await openDb();
  const existing = await db.items.get(id);
  if (!existing) throw new Error("This piece was not found.");

  let originalImageId = existing.originalImageId;
  let coverImageId = existing.coverImageId;
  let newImages: StoredImage[] | null = null;
  let removeImageIds: string[] = [];

  if (file) {
    const processed = await processImageFile(file);
    originalImageId = createId();
    coverImageId = createId();
    newImages = buildImageRecords(id, originalImageId, coverImageId, processed);
    const old = await db.images.where("itemId").equals(id).toArray();
    removeImageIds = old.map((img) => img.id);
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
    coverImageId,
  };

  await db.transaction("rw", db.items, db.images, async () => {
    await db.items.put(updated);
    if (removeImageIds.length) await db.images.bulkDelete(removeImageIds);
    if (newImages) await db.images.bulkAdd(newImages);
  });

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
      await db.items.put(item);
    }
    if (images.length) await db.images.bulkPut(images);
  });

  return { added, replaced };
}

export { clearWardrobeData };

function buildImageRecords(
  itemId: string,
  originalImageId: string,
  coverImageId: string,
  processed: ProcessedImage,
): StoredImage[] {
  const stamp = nowIso();
  const ext = extensionForMime(processed.mimeType);
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
    },
    {
      id: coverImageId,
      itemId,
      role: "cover",
      source: "user_photo",
      mimeType: processed.coverBlob.type || processed.mimeType,
      width: processed.width,
      height: processed.height,
      filename: `${coverImageId}.${extensionForMime(processed.coverBlob.type || processed.mimeType)}`,
      blob: processed.coverBlob,
      createdAt: stamp,
    },
  ];
}
