import Dexie, { type EntityTable } from "dexie";
import type { StoredImage, WardrobeItem } from "@/domain/types";

export type AtelierDB = Dexie & {
  items: EntityTable<WardrobeItem, "id">;
  images: EntityTable<StoredImage, "id">;
};

let dbInstance: AtelierDB | null = null;
let openPromise: Promise<AtelierDB> | null = null;

export function getDb(): AtelierDB {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is only available in the browser");
  }
  if (!dbInstance) {
    const db = new Dexie("atelier-wardrobe") as AtelierDB;
    db.version(1).stores({
      items:
        "id, name, category, createdAt, updatedAt, isFavorite, sortOrder",
      images: "id, itemId, role, source",
    });
    dbInstance = db;
  }
  return dbInstance;
}

export async function openDb(timeoutMs = 4000): Promise<AtelierDB> {
  const db = getDb();
  if (db.isOpen()) return db;
  if (!openPromise) {
    openPromise = Promise.race([
      db.open().then(() => db),
      new Promise<AtelierDB>((_, reject) => {
        window.setTimeout(() => {
          reject(
            new Error(
              "Browser storage is unavailable or blocked. Try another browser, or check privacy settings.",
            ),
          );
        }, timeoutMs);
      }),
    ]).finally(() => {
      openPromise = null;
    });
  }
  return openPromise;
}

export async function clearWardrobeData(): Promise<void> {
  const db = await openDb();
  await db.transaction("rw", db.items, db.images, async () => {
    await db.items.clear();
    await db.images.clear();
  });
}
