"use client";

import type { DisplayItem } from "@/domain/types";
import { CATEGORY_LABELS } from "@/domain/labels";
import { cn } from "@/lib/cn";

/** Deterministic editorial span pattern — never reshuffles on refresh. */
function layoutForIndex(index: number, total: number): string {
  if (total === 1) {
    return "col-span-2 md:col-span-8 md:col-start-3 aspect-[3/4] md:aspect-[4/5]";
  }
  if (total === 2) {
    return index === 0
      ? "col-span-2 md:col-span-7 aspect-[3/4] md:aspect-[4/5]"
      : "col-span-2 md:col-span-5 aspect-[3/4] md:mt-20";
  }
  if (total <= 5) {
    const map = [
      "col-span-2 md:col-span-7 aspect-[3/4]",
      "col-span-1 md:col-span-5 aspect-[3/4] md:mt-16",
      "col-span-1 md:col-span-4 aspect-[4/5]",
      "col-span-2 md:col-span-4 md:col-start-5 aspect-[3/4] md:mt-10",
      "col-span-2 md:col-span-4 aspect-[4/5]",
    ];
    return map[index] ?? "col-span-1 md:col-span-4 aspect-[3/4]";
  }
  // 6+: cycling templates — hero, pair, staggered pair, chapter rhythm
  const pattern = [
    "col-span-2 md:col-span-7 aspect-[3/4]",
    "col-span-1 md:col-span-5 aspect-[4/5] md:mt-14",
    "col-span-1 md:col-span-5 aspect-[3/4]",
    "col-span-1 md:col-span-7 aspect-[4/5] md:mt-10",
    "col-span-2 md:col-span-4 aspect-[3/4]",
    "col-span-1 md:col-span-4 aspect-[4/5] md:mt-16",
    "col-span-1 md:col-span-4 aspect-[3/4]",
    "col-span-2 md:col-span-8 md:col-start-3 aspect-[3/4] md:aspect-[16/10]",
  ];
  return pattern[index % pattern.length];
}

function chapterBefore(index: number, total: number): string | null {
  if (total < 6) return null;
  if (index === 0) return "Opening looks";
  if (index === 4) return "Further pieces";
  return null;
}

export function GalleryView({
  items,
  onSelect,
  highlightId,
}: {
  items: DisplayItem[];
  onSelect: (item: DisplayItem) => void;
  highlightId?: string | null;
}) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-12 md:gap-6">
      {items.map((item, index) => {
        const chapter = chapterBefore(index, items.length);
        const highlighted = highlightId === item.id;
        return (
          <div key={item.id} className="contents">
            {chapter ? (
              <p className="col-span-2 md:col-span-12 mt-4 mb-1 font-display text-sm tracking-[0.18em] uppercase text-warm-gray md:mt-10">
                {chapter}
              </p>
            ) : null}
            <button
              type="button"
              aria-label={item.name}
              id={highlighted ? `piece-${item.id}` : undefined}
              onClick={() => onSelect(item)}
              className={cn(
                "group relative min-h-[11rem] overflow-hidden bg-[#EDE8E0] text-left transition-[transform,box-shadow] duration-500 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne animate-fade-up motion-reduce:active:scale-100",
                layoutForIndex(index, items.length),
                highlighted && "ring-1 ring-champagne ring-offset-2 ring-offset-ivory",
              )}
              style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
            >
              {item.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.coverUrl}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-warm-gray text-sm">
                  No image
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/55 via-charcoal/20 to-transparent px-2.5 pb-2.5 pt-10 opacity-100 transition-opacity duration-300 md:px-4 md:pb-3.5 md:pt-14 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                <p className="font-display text-sm leading-tight text-ivory sm:text-base md:text-lg line-clamp-2">
                  {item.name}
                </p>
                <p className="mt-0.5 truncate text-[10px] tracking-[0.12em] uppercase text-ivory/80 sm:text-[11px]">
                  {CATEGORY_LABELS[item.category]}
                  {item.brand ? ` · ${item.brand}` : ""}
                </p>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
