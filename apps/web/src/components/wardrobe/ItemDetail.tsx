"use client";

import { useEffect } from "react";
import { Heart, X } from "lucide-react";
import type { DisplayItem } from "@/domain/types";
import { CATEGORY_LABELS, SEASON_LABELS } from "@/domain/labels";
import { Button } from "@/components/ui/Button";

export function ItemDetail({
  item,
  onClose,
  onToggleFavorite,
  onDelete,
  editable = false,
}: {
  item: DisplayItem;
  onClose: () => void;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  editable?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/40 p-0 md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-detail-title"
      data-testid="item-detail"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[min(94svh,56rem)] w-full max-w-3xl flex-col overflow-hidden bg-ivory animate-rise md:grid md:max-h-[92vh] md:grid-cols-2 md:overflow-y-auto">
        <div className="relative aspect-[4/5] max-h-[42svh] shrink-0 bg-[#EFEBE4] sm:aspect-[3/4] md:aspect-auto md:max-h-none md:min-h-[28rem]">
          {item.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.coverUrl}
              alt={item.name}
              className="h-full w-full object-contain p-4 sm:p-6"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-warm-gray">
              No image
            </div>
          )}
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-6 md:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 touch-target inline-flex items-center justify-center text-warm-gray hover:text-charcoal md:right-4 md:top-4"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          {item.isDemo ? (
            <p className="text-[11px] tracking-[0.2em] uppercase text-champagne">
              Demo Collection
            </p>
          ) : null}
          <h2
            id="item-detail-title"
            className="mt-2 pr-10 font-display text-[1.75rem] leading-tight text-charcoal sm:text-3xl"
          >
            {item.name}
          </h2>
          <p className="mt-2 text-sm text-warm-gray">
            {item.brand ? `${item.brand} · ` : ""}
            {CATEGORY_LABELS[item.category]}
          </p>

          <dl className="mt-6 space-y-3 text-sm sm:mt-8">
            {item.colors.length ? (
              <div>
                <dt className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Colors
                </dt>
                <dd className="mt-1 text-charcoal">{item.colors.join(", ")}</dd>
              </div>
            ) : null}
            {item.seasons.length ? (
              <div>
                <dt className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Seasons
                </dt>
                <dd className="mt-1 text-charcoal">
                  {item.seasons.map((s) => SEASON_LABELS[s]).join(", ")}
                </dd>
              </div>
            ) : null}
            {item.material ? (
              <div>
                <dt className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Material
                </dt>
                <dd className="mt-1 text-charcoal">{item.material}</dd>
              </div>
            ) : null}
            {item.notes ? (
              <div>
                <dt className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Notes
                </dt>
                <dd className="mt-1 text-charcoal leading-relaxed">{item.notes}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8 flex flex-col gap-3 pt-2 sm:mt-auto sm:flex-row sm:flex-wrap sm:pt-10">
            {onToggleFavorite ? (
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={onToggleFavorite}
              >
                <Heart
                  size={14}
                  className={item.isFavorite ? "fill-champagne text-champagne" : ""}
                />
                {item.isFavorite ? "Favorited" : "Favorite"}
              </Button>
            ) : null}
            {editable ? (
              <Button
                href={`/wardrobe/edit?id=${encodeURIComponent(item.id)}`}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Edit
              </Button>
            ) : null}
            {onDelete ? (
              <Button
                type="button"
                variant="danger"
                className="w-full sm:w-auto"
                onClick={onDelete}
              >
                Delete
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
