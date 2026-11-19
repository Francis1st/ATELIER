import type { DisplayItem, WardrobeFilters } from "./types";
import { CATEGORY_LABELS } from "./labels";

export function filterAndSortItems(
  items: DisplayItem[],
  filters: WardrobeFilters,
): DisplayItem[] {
  const q = filters.query.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (filters.favoritesOnly && !item.isFavorite) return false;
    if (filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    if (filters.season !== "all" && !item.seasons.includes(filters.season)) {
      return false;
    }
    if (
      filters.color !== "all" &&
      !item.colors.some((c) => c.toLowerCase() === filters.color.toLowerCase())
    ) {
      return false;
    }
    if (!q) return true;
    const haystack = [
      item.name,
      item.brand ?? "",
      item.model ?? "",
      CATEGORY_LABELS[item.category],
      ...item.colors,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "category":
      sorted.sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
      );
      break;
    case "recent":
    default:
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
  }
  return sorted;
}

export const DEFAULT_FILTERS: WardrobeFilters = {
  query: "",
  category: "all",
  season: "all",
  color: "all",
  favoritesOnly: false,
  sort: "recent",
};
