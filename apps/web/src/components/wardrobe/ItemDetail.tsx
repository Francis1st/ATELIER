"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Heart, X } from "lucide-react";
import {
  coverTypeLabel,
  type ActiveCoverType,
  type DisplayItem,
} from "@/domain/types";
import { CATEGORY_LABELS, SEASON_LABELS } from "@/domain/labels";
import { Button } from "@/components/ui/Button";

export function ItemDetail({
  item,
  onClose,
  onToggleFavorite,
  onDelete,
  onSetCover,
  editable = false,
}: {
  item: DisplayItem;
  onClose: () => void;
  onToggleFavorite?: () => void;
  onDelete?: () => void;
  onSetCover?: (type: ActiveCoverType) => Promise<void> | void;
  editable?: boolean;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/45 p-0 md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-testid="item-detail"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[min(96svh,58rem)] w-full max-w-4xl flex-col overflow-hidden bg-ivory animate-rise md:grid md:max-h-[92vh] md:grid-cols-2 md:overflow-y-auto">
        <div className="relative aspect-[4/5] max-h-[48svh] shrink-0 bg-[#EDE8E0] sm:aspect-[3/4] md:aspect-auto md:max-h-none md:min-h-[32rem]">
          {item.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.coverUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-warm-gray">
              No image
            </div>
          )}
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-7 md:p-10">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 touch-target inline-flex items-center justify-center text-warm-gray hover:text-charcoal md:right-5 md:top-5"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          {item.isDemo ? (
            <p className="text-[11px] tracking-[0.2em] uppercase text-champagne">
              Demo Collection
            </p>
          ) : null}
          {!item.isDemo && item.activeCoverType === "ai" ? (
            <p className="text-[11px] tracking-[0.2em] uppercase text-champagne">
              AI Curated — not brand photography
            </p>
          ) : !item.isDemo && item.activeCoverType === "curated" ? (
            <p className="text-[11px] tracking-[0.2em] uppercase text-warm-gray">
              Studio Clean
            </p>
          ) : null}
          <h2
            id={titleId}
            className="mt-2 pr-10 font-display text-[1.85rem] leading-tight text-charcoal sm:text-[2rem]"
          >
            {item.name}
          </h2>
          <p className="mt-2 text-sm tracking-[0.04em] text-warm-gray">
            {item.brand ? `${item.brand} · ` : ""}
            {CATEGORY_LABELS[item.category]}
          </p>

          {editable && onSetCover ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {(
                [
                  ["original", Boolean(item.originalImageId)],
                  ["curated", Boolean(item.curatedImageId || item.coverImageId)],
                  ["ai", Boolean(item.aiCuratedImageId)],
                ] as const
              ).map(([type, available]) =>
                available ? (
                  <button
                    key={type}
                    type="button"
                    onClick={() => void onSetCover(type)}
                    className={`min-h-11 border px-3 text-[11px] tracking-[0.12em] uppercase ${
                      (item.activeCoverType ?? "curated") === type
                        ? "border-charcoal text-charcoal"
                        : "border-border text-warm-gray"
                    }`}
                    aria-pressed={(item.activeCoverType ?? "curated") === type}
                  >
                    {coverTypeLabel(type)}
                  </button>
                ) : null,
              )}
            </div>
          ) : null}

          <dl className="mt-8 space-y-4 text-sm">
            {item.colors.length ? (
              <div>
                <dt className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Colors
                </dt>
                <dd className="mt-1.5 text-charcoal">{item.colors.join(", ")}</dd>
              </div>
            ) : null}
            {item.seasons.length ? (
              <div>
                <dt className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Seasons
                </dt>
                <dd className="mt-1.5 text-charcoal">
                  {item.seasons.map((s) => SEASON_LABELS[s]).join(", ")}
                </dd>
              </div>
            ) : null}
            {item.material ? (
              <div>
                <dt className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Material
                </dt>
                <dd className="mt-1.5 text-charcoal">{item.material}</dd>
              </div>
            ) : null}
            {item.notes ? (
              <div>
                <dt className="text-[11px] tracking-[0.14em] uppercase text-warm-gray">
                  Notes
                </dt>
                <dd className="mt-1.5 text-charcoal leading-relaxed">
                  {item.notes}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-8 flex flex-col gap-3 pt-2 sm:mt-auto sm:pt-12">
            {confirmDelete ? (
              <div className="space-y-3 border border-border p-4">
                <p className="text-sm text-charcoal">
                  Remove this piece from your wardrobe? This cannot be undone.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="danger"
                    className="w-full sm:w-auto"
                    onClick={() => onDelete?.()}
                  >
                    Confirm delete
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full sm:w-auto"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Keep piece
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {onToggleFavorite ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    onClick={onToggleFavorite}
                  >
                    <Heart
                      size={14}
                      className={
                        item.isFavorite
                          ? "fill-champagne text-champagne"
                          : ""
                      }
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
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
