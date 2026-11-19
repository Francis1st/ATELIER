"use client";

import { useWardrobe } from "@/hooks/useWardrobe";
import { WardrobeBrowser } from "@/components/wardrobe/WardrobeBrowser";
import { ImportExportPanel } from "@/components/wardrobe/ImportExportPanel";
import {
  deleteItem,
  toggleFavorite,
} from "@/services/wardrobe/repository";

export function WardrobeClient() {
  const { items, loading, error, refresh } = useWardrobe();

  return (
    <div className="space-y-12">
      <WardrobeBrowser
        items={items}
        loading={loading}
        error={error}
        editable
        emptyTitle="Your wardrobe awaits"
        emptyBody="Add your first piece. Photos stay on this device — no account required."
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
