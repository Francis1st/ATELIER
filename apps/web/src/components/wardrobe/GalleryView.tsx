"use client";

import type { DisplayItem } from "@/domain/types";
import { CATEGORY_LABELS } from "@/domain/labels";
import { cn } from "@/lib/cn";

/** Deterministic editorial span pattern — never reshuffles on refresh. */
function layoutForIndex(index: number, total: number): string {
  if (total === 1) {
    return "col-span-2 md:col-span-6 aspect-[3/4] md:aspect-[4/5]";
  }
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
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-6 md:gap-6">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          aria-label={item.name}
          onClick={() => onSelect(item)}
          className={cn(
            "group relative min-h-[11rem] overflow-hidden bg-[#EFEBE4] text-left transition-transform active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne animate-fade-up motion-reduce:active:scale-100",
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
              className="h-full w-full object-contain p-2 sm:p-3 transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-warm-gray text-sm">
              No image
            </div>
          )}
          {/* Always visible on touch/mobile; hover reveal on desktop */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ivory/95 via-ivory/75 to-transparent px-2.5 pb-2.5 pt-8 opacity-100 transition-opacity duration-300 md:px-4 md:pb-3 md:pt-10 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
            <p className="font-display text-sm leading-tight text-charcoal sm:text-base md:text-lg line-clamp-2">
              {item.name}
            </p>
            <p className="mt-0.5 truncate text-[10px] tracking-[0.12em] uppercase text-warm-gray sm:text-[11px] sm:tracking-[0.14em]">
              {CATEGORY_LABELS[item.category]}
              {item.brand ? ` · ${item.brand}` : ""}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
