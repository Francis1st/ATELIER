import type { Category, Season, SortOption } from "./types";

export const CATEGORY_LABELS: Record<Category, string> = {
  tops: "Tops",
  bottoms: "Bottoms",
  outerwear: "Outerwear",
  dresses: "Dresses",
  footwear: "Footwear",
  bags: "Bags",
  accessories: "Accessories",
};

export const SEASON_LABELS: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

export const SORT_LABELS: Record<SortOption, string> = {
  recent: "Recently added",
  name: "Name",
  category: "Category",
};

export const COLOR_PRESETS = [
  "Black",
  "White",
  "Ivory",
  "Beige",
  "Navy",
  "Gray",
  "Brown",
  "Camel",
  "Olive",
  "Burgundy",
  "Blue",
  "Green",
] as const;
