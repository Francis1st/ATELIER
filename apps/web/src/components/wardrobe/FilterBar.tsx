"use client";

import { useState } from "react";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, SEASONS, type WardrobeFilters, type ViewMode } from "@/domain/types";
import { CATEGORY_LABELS, COLOR_PRESETS, SEASON_LABELS, SORT_LABELS } from "@/domain/labels";
import { cn } from "@/lib/cn";

const selectClass =
  "min-h-11 w-full appearance-none border border-border bg-transparent px-3 py-2.5 text-base text-charcoal focus:border-champagne focus:outline-none md:text-sm";

function activeFilterCount(filters: WardrobeFilters): number {
  let n = 0;
  if (filters.category !== "all") n += 1;
  if (filters.season !== "all") n += 1;
  if (filters.color !== "all") n += 1;
  if (filters.sort !== "recent") n += 1;
  if (filters.favoritesOnly) n += 1;
  return n;
}

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const active = activeFilterCount(filters);

  return (
    <div className="sticky top-[calc(3.5rem+var(--safe-top))] z-30 -mx-4 space-y-3 border-b border-border bg-ivory/95 px-4 py-3 backdrop-blur-sm sm:-mx-5 sm:top-[calc(4rem+var(--safe-top))] sm:px-5 md:static md:top-auto md:mx-0 md:space-y-4 md:bg-transparent md:px-0 md:py-0 md:pb-5 md:backdrop-blur-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full flex-1 sm:max-w-md">
          <span className="sr-only">Search</span>
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray"
          />
          <input
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search name or brand"
            className="w-full min-h-11 border border-border bg-transparent py-2.5 pl-10 pr-3 text-base text-charcoal placeholder:text-warm-gray/70 focus:border-champagne focus:outline-none md:text-sm"
            enterKeyHint="search"
            autoCapitalize="off"
            autoCorrect="off"
          />
        </label>
        <div
          className="grid w-full grid-cols-2 border border-border sm:inline-flex sm:w-auto"
          role="group"
          aria-label="View mode"
        >
          {(["gallery", "grid"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewChange(mode)}
              className={cn(
                "min-h-11 px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors active:opacity-80",
                view === mode
                  ? "bg-charcoal text-ivory"
                  : "text-warm-gray",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between border border-border px-3 text-[11px] tracking-[0.14em] uppercase text-charcoal md:hidden"
        aria-expanded={filtersOpen}
        onClick={() => setFiltersOpen((v) => !v)}
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal size={14} />
          Filters
          {active > 0 ? (
            <span className="bg-champagne/30 px-1.5 py-0.5 text-[10px] text-charcoal">
              {active}
            </span>
          ) : null}
        </span>
        <ChevronDown
          size={16}
          className={cn("transition-transform", filtersOpen && "rotate-180")}
        />
      </button>

      <div
        className={cn(
          "grid-cols-2 gap-2 sm:gap-3 md:flex md:flex-wrap",
          filtersOpen ? "grid" : "hidden md:flex",
        )}
      >
        <select
          aria-label="Category"
          value={filters.category}
          onChange={(e) =>
            onChange({
              ...filters,
              category: e.target.value as WardrobeFilters["category"],
            })
          }
          className={selectClass}
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
          className={selectClass}
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
          className={selectClass}
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
          className={selectClass}
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
            "col-span-2 min-h-11 border px-3 py-2 text-[11px] tracking-[0.14em] uppercase active:opacity-80 sm:col-span-1",
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
