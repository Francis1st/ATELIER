"use client";

import { useEffect, useState } from "react";
import type { WardrobeItem } from "@/domain/types";
import { getImage, getItem } from "@/services/wardrobe/repository";
import { ItemForm } from "@/components/wardrobe/ItemForm";
import { useObjectUrl } from "@/hooks/useObjectUrl";

export function EditItemClient({ id }: { id: string }) {
  const [item, setItem] = useState<WardrobeItem | null>(null);
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const coverUrl = useObjectUrl(coverBlob);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const found = await getItem(id);
        if (!found) {
          if (!cancelled) setError("This piece was not found.");
          return;
        }
        let blob: Blob | null = null;
        if (found.coverImageId) {
          const img = await getImage(found.coverImageId);
          blob = img?.blob ?? null;
        }
        if (!cancelled) {
          setItem(found);
          setCoverBlob(blob);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load piece.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <p className="text-sm tracking-[0.14em] uppercase text-warm-gray">
        Loading…
      </p>
    );
  }
  if (error || !item) {
    return (
      <p className="text-sm text-red-800" role="alert">
        {error ?? "Not found"}
      </p>
    );
  }

  return <ItemForm initial={item} existingImageUrl={coverUrl} />;
}
