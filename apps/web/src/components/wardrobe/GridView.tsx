"use client";

import { Heart } from "lucide-react";
import type { DisplayItem } from "@/domain/types";
import { CATEGORY_LABELS } from "@/domain/labels";

export function GridView({
  items,
  onSelect,
}: {
  items: DisplayItem[];
  onSelect: (item: DisplayItem) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-label={item.name}
          onClick={() => onSelect(item)}
          className="group min-w-0 text-left transition-transform active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne motion-reduce:active:scale-100"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-[#EDE8E0]">
            {item.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.coverUrl}
                alt={item.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-warm-gray">
                No image
              </div>
            )}
            {item.isFavorite ? (
              <Heart
                className="absolute right-2 top-2 fill-champagne text-champagne"
                size={14}
                aria-label="Favorite"
              />
            ) : null}
          </div>
          <div className="mt-2 px-0.5">
            <p className="truncate text-sm text-charcoal">{item.name}</p>
            <p className="mt-0.5 text-[11px] tracking-[0.12em] uppercase text-warm-gray">
              {CATEGORY_LABELS[item.category]}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
