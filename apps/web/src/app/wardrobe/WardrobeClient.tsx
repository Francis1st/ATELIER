"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWardrobe } from "@/hooks/useWardrobe";
import { WardrobeBrowser } from "@/components/wardrobe/WardrobeBrowser";
import { ImportExportPanel } from "@/components/wardrobe/ImportExportPanel";
import {
  deleteItem,
  getImage,
  resolveActiveCoverId,
  setActiveCover,
  toggleFavorite,
} from "@/services/wardrobe/repository";
import type { DisplayItem } from "@/domain/types";

export function WardrobeClient() {
  const { items, loading, error, refresh } = useWardrobe();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  useEffect(() => {
    if (!highlightId || loading) return;
    const t = window.setTimeout(() => {
      document
        .getElementById(`piece-${highlightId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
    return () => window.clearTimeout(t);
  }, [highlightId, loading, items.length]);

  return (
    <div className="space-y-12">
      <WardrobeBrowser
        items={items}
        loading={loading}
        error={error}
        editable
        highlightId={highlightId}
        emptyTitle="Your wardrobe awaits"
        emptyBody="Photograph one piece you love. It stays on this device — your first gallery frame starts here."
        emptyCtaHref="/wardrobe/new"
        emptyCtaLabel="Add a piece"
        onToggleFavorite={async (item) => {
          await toggleFavorite(item.id);
          await refresh();
        }}
        onDelete={async (item) => {
          await deleteItem(item.id);
          await refresh();
        }}
        onSetCover={async (item, type) => {
          const updated = await setActiveCover(item.id, type);
          await refresh();
          const coverId = resolveActiveCoverId(updated);
          let coverUrl: string | undefined;
          if (coverId) {
            const img = await getImage(coverId);
            if (img?.blob) coverUrl = URL.createObjectURL(img.blob);
          }
          if (item.coverUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(item.coverUrl);
          }
          return { ...updated, coverUrl } satisfies DisplayItem;
        }}
      />
      <ImportExportPanel onDone={() => void refresh()} />
    </div>
  );
}
