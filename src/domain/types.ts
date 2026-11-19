export const CATEGORIES = [
  "tops",
  "bottoms",
  "outerwear",
  "dresses",
  "footwear",
  "bags",
  "accessories",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export type Season = (typeof SEASONS)[number];

export const IMAGE_SOURCES = ["user_photo", "demo_asset"] as const;
export type ImageSource = (typeof IMAGE_SOURCES)[number];

export const IMAGE_ROLES = ["original", "cover"] as const;
export type ImageRole = (typeof IMAGE_ROLES)[number];

export type WardrobeItem = {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  category: Category;
  subcategory?: string;
  colors: string[];
  seasons: Season[];
  material?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  currency?: string;
  notes?: string;
  isFavorite: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  originalImageId?: string;
  coverImageId?: string;
};

export type StoredImage = {
  id: string;
  itemId: string;
  role: ImageRole;
  source: ImageSource;
  mimeType: string;
  width: number;
  height: number;
  filename: string;
  blob: Blob;
  createdAt: string;
};

export type ViewMode = "gallery" | "grid";

export type SortOption = "recent" | "name" | "category";

export type WardrobeFilters = {
  query: string;
  category: Category | "all";
  season: Season | "all";
  color: string | "all";
  favoritesOnly: boolean;
  sort: SortOption;
};

export type DisplayItem = WardrobeItem & {
  coverUrl?: string;
  isDemo?: boolean;
};
