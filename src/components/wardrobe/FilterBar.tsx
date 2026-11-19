"use client";

import { Search } from "lucide-react";
import { CATEGORIES, SEASONS, type WardrobeFilters, type ViewMode } from "@/domain/types";
import { CATEGORY_LABELS, COLOR_PRESETS, SEASON_LABELS, SORT_LABELS } from "@/domain/labels";
import { cn } from "@/lib/cn";

export function FilterBar({
  filters,
  onChange,
  view,
  onViewChange,
  colors = COLOR_PRESETS as unknown as string[],
}: {
  filters: WardrobeFilters;
  onChange: (next: WardrobeFilters) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  colors?: string[];
}) {
  return (
    <div className="space-y-4 border-b border-border pb-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="relative block flex-1 max-w-md">
          <span className="sr-only">Search</span>
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray"
          />
          <input
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search name or brand"
            className="w-full border border-border bg-transparent py-2.5 pl-10 pr-3 text-sm text-charcoal placeholder:text-warm-gray/70 focus:border-champagne focus:outline-none"
          />
        </label>
        <div
          className="inline-flex border border-border"
          role="group"
          aria-label="View mode"
        >
          {(["gallery", "grid"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewChange(mode)}
              className={cn(
                "px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors",
                view === mode
                  ? "bg-charcoal text-ivory"
                  : "text-warm-gray hover:text-charcoal",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3">
        <select
          aria-label="Category"
          value={filters.category}
          onChange={(e) =>
            onChange({
              ...filters,
              category: e.target.value as WardrobeFilters["category"],
            })
          }
          className="border border-border bg-transparent px-3 py-2 text-sm text-charcoal focus:border-champagne focus:outline-none"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>

        <select
          aria-label="Season"
          value={filters.season}
          onChange={(e) =>
            onChange({
              ...filters,
              season: e.target.value as WardrobeFilters["season"],
            })
          }
          className="border border-border bg-transparent px-3 py-2 text-sm text-charcoal focus:border-champagne focus:outline-none"
        >
          <option value="all">All seasons</option>
          {SEASONS.map((s) => (
            <option key={s} value={s}>
              {SEASON_LABELS[s]}
            </option>
          ))}
        </select>

        <select
          aria-label="Color"
          value={filters.color}
          onChange={(e) => onChange({ ...filters, color: e.target.value })}
          className="border border-border bg-transparent px-3 py-2 text-sm text-charcoal focus:border-champagne focus:outline-none"
        >
          <option value="all">All colors</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort"
          value={filters.sort}
          onChange={(e) =>
            onChange({
              ...filters,
              sort: e.target.value as WardrobeFilters["sort"],
            })
          }
          className="border border-border bg-transparent px-3 py-2 text-sm text-charcoal focus:border-champagne focus:outline-none"
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, favoritesOnly: !filters.favoritesOnly })
          }
          className={cn(
            "border px-3 py-2 text-[11px] tracking-[0.14em] uppercase",
            filters.favoritesOnly
              ? "border-champagne text-charcoal"
              : "border-border text-warm-gray",
          )}
          aria-pressed={filters.favoritesOnly}
        >
          Favorites
        </button>
      </div>
    </div>
  );
}
