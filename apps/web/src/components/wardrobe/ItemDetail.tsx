"use client";

import { useEffect } from "react";
import Link from "next/link";
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
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-ivory shadow-none animate-rise md:grid md:grid-cols-2">
        <div className="relative aspect-[3/4] bg-[#EFEBE4] md:aspect-auto md:min-h-[28rem]">
          {item.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.coverUrl}
              alt={item.name}
              className="h-full w-full object-contain p-6"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-warm-gray">
              No image
            </div>
          )}
        </div>
        <div className="relative flex flex-col p-6 md:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-warm-gray hover:text-charcoal"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          {item.isDemo ? (
            <p className="text-[11px] tracking-[0.2em] uppercase text-champagne">
              Demo Collection
            </p>
          ) : null}
          <h2
            id="item-detail-title"
            className="mt-2 font-display text-3xl text-charcoal pr-8"
          >
            {item.name}
          </h2>
          <p className="mt-2 text-sm text-warm-gray">
            {item.brand ? `${item.brand} · ` : ""}
            {CATEGORY_LABELS[item.category]}
          </p>

          <dl className="mt-8 space-y-3 text-sm">
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

          <div className="mt-auto flex flex-wrap gap-3 pt-10">
            {onToggleFavorite ? (
              <Button type="button" variant="secondary" onClick={onToggleFavorite}>
                <Heart
                  size={14}
                  className={item.isFavorite ? "fill-champagne text-champagne" : ""}
                />
                {item.isFavorite ? "Favorited" : "Favorite"}
              </Button>
            ) : null}
            {editable ? (
              <Link href={`/wardrobe/${item.id}/edit`}>
                <Button type="button" variant="secondary">
                  Edit
                </Button>
              </Link>
            ) : null}
            {onDelete ? (
              <Button type="button" variant="danger" onClick={onDelete}>
                Delete
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
