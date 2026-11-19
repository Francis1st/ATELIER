"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useWardrobe } from "@/hooks/useWardrobe";
import { WardrobeBrowser } from "@/components/wardrobe/WardrobeBrowser";
import { ImportExportPanel } from "@/components/wardrobe/ImportExportPanel";
import {
  deleteItem,
  toggleFavorite,
} from "@/services/wardrobe/repository";

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
      />
      <ImportExportPanel onDone={() => void refresh()} />
    </div>
  );
}
