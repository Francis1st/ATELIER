"use client";

import { useMemo, useState } from "react";
import type { ActiveCoverType, DisplayItem, ViewMode } from "@/domain/types";
import { DEFAULT_FILTERS, filterAndSortItems } from "@/domain/filter";
import { FilterBar } from "@/components/wardrobe/FilterBar";
import { GalleryView } from "@/components/wardrobe/GalleryView";
import { GridView } from "@/components/wardrobe/GridView";
import { ItemDetail } from "@/components/wardrobe/ItemDetail";
import { EmptyState } from "@/components/wardrobe/EmptyState";

export function WardrobeBrowser({
  items,
  loading,
  error,
  editable = false,
  emptyTitle,
  emptyBody,
  emptyCtaHref,
  emptyCtaLabel,
  highlightId,
  onToggleFavorite,
  onDelete,
  onSetCover,
}: {
  items: DisplayItem[];
  loading?: boolean;
  error?: string | null;
  editable?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
  emptyCtaHref?: string;
  emptyCtaLabel?: string;
  highlightId?: string | null;
  onToggleFavorite?: (item: DisplayItem) => Promise<void> | void;
  onDelete?: (item: DisplayItem) => Promise<void> | void;
  onSetCover?: (
    item: DisplayItem,
    type: ActiveCoverType,
  ) => Promise<DisplayItem | void> | DisplayItem | void;
}) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState<ViewMode>("gallery");
  const [selected, setSelected] = useState<DisplayItem | null>(null);

  const colors = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) for (const c of item.colors) set.add(c);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const visible = useMemo(
    () => filterAndSortItems(items, filters),
    [items, filters],
  );

  if (loading) {
    return (
      <p className="py-24 text-center text-sm tracking-[0.16em] uppercase text-warm-gray">
        Loading collection…
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-24 text-center text-sm text-red-800" role="alert">
        {error}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        body={emptyBody}
        ctaHref={emptyCtaHref}
        ctaLabel={emptyCtaLabel}
        deferCtaToMobileBar={editable}
      />
    );
  }

  return (
    <div className="space-y-8">
      <FilterBar
        filters={filters}
        onChange={setFilters}
        view={view}
        onViewChange={setView}
        colors={colors.length ? colors : undefined}
      />

      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-2xl text-charcoal">No pieces match</p>
          <p className="mt-2 text-sm text-warm-gray">
            Adjust filters or clear search to see your collection again.
          </p>
        </div>
      ) : view === "gallery" ? (
        <GalleryView
          items={visible}
          onSelect={setSelected}
          highlightId={highlightId}
        />
      ) : (
        <GridView items={visible} onSelect={setSelected} />
      )}

      {selected ? (
        <ItemDetail
          item={selected}
          editable={editable}
          onClose={() => setSelected(null)}
          onToggleFavorite={
            onToggleFavorite
              ? async () => {
                  await onToggleFavorite(selected);
                  setSelected((s) =>
                    s ? { ...s, isFavorite: !s.isFavorite } : s,
                  );
                }
              : undefined
          }
          onDelete={
            onDelete
              ? async () => {
                  await onDelete(selected);
                  setSelected(null);
                }
              : undefined
          }
          onSetCover={
            onSetCover
              ? async (type) => {
                  const next = await onSetCover(selected, type);
                  if (next) setSelected(next);
                }
              : undefined
          }
        />
      ) : null}
    </div>
  );
}
