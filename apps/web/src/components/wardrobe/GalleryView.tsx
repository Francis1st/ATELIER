"use client";

import type { DisplayItem } from "@/domain/types";
import { CATEGORY_LABELS } from "@/domain/labels";
import { cn } from "@/lib/cn";

/** Deterministic editorial span pattern — never reshuffles on refresh. */
function layoutForIndex(index: number, total: number): string {
  if (total === 1) return "col-span-2 md:col-span-6 row-span-1 aspect-[3/4] md:aspect-[4/5]";
  if (total <= 3) {
    const map = [
      "col-span-2 md:col-span-4 aspect-[3/4]",
      "col-span-1 md:col-span-2 aspect-[3/4] md:mt-16",
      "col-span-1 md:col-span-3 md:col-start-4 aspect-[4/5]",
    ];
    return map[index] ?? "col-span-1 md:col-span-2 aspect-[3/4]";
  }
  const pattern = [
    "col-span-2 md:col-span-4 aspect-[3/4]",
    "col-span-1 md:col-span-2 aspect-[4/5] md:mt-12",
    "col-span-1 md:col-span-2 aspect-[3/4]",
    "col-span-2 md:col-span-3 aspect-[4/5] md:mt-8",
    "col-span-1 md:col-span-3 aspect-[3/4]",
    "col-span-1 md:col-span-2 aspect-[4/5] md:mt-16",
    "col-span-2 md:col-span-4 aspect-[3/4]",
    "col-span-1 md:col-span-2 aspect-[3/4]",
  ];
  return pattern[index % pattern.length];
}

export function GalleryView({
  items,
  onSelect,
}: {
  items: DisplayItem[];
  onSelect: (item: DisplayItem) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          aria-label={item.name}
          onClick={() => onSelect(item)}
          className={cn(
            "group relative overflow-hidden bg-[#EFEBE4] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne animate-fade-up",
            layoutForIndex(index, items.length),
          )}
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
        >
          {item.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.coverUrl}
              alt={item.name}
              loading="lazy"
              className="h-full w-full object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-warm-gray text-sm">
              No image
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ivory/95 via-ivory/70 to-transparent px-3 pb-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:px-4">
            <p className="font-display text-lg text-charcoal leading-tight">
              {item.name}
            </p>
            <p className="mt-1 text-[11px] tracking-[0.14em] uppercase text-warm-gray">
              {CATEGORY_LABELS[item.category]}
              {item.brand ? ` · ${item.brand}` : ""}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
