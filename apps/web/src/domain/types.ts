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

export const IMAGE_SOURCES = [
  "user_photo",
  "demo_asset",
  "licensed_catalog",
] as const;
export type ImageSource = (typeof IMAGE_SOURCES)[number];

/**
 * original = archival bytes (never overwritten)
 * cover = Studio Clean (local crop/frame) — ZIP v1/v2 role name kept for compat
 * ai_curated = optional cloud figure-to-figure result (ZIP v3+)
 */
export const IMAGE_ROLES = ["original", "cover", "ai_curated"] as const;
export type ImageRole = (typeof IMAGE_ROLES)[number];

/** curated = Studio Clean in product copy */
export const ACTIVE_COVER_TYPES = ["original", "curated", "ai"] as const;
export type ActiveCoverType = (typeof ACTIVE_COVER_TYPES)[number];

export const LICENSE_STATUSES = [
  "user_owned",
  "unknown",
  "link_only",
  "licensed_for_display",
  "forbidden",
] as const;
export type LicenseStatus = (typeof LICENSE_STATUSES)[number];

export type ImageSourceMeta = {
  sourceType: ImageSource;
  sourceUrl?: string;
  licenseStatus: LicenseStatus;
  attribution?: string;
  licenseReference?: string;
  userConfirmedAt?: string;
};

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
  /** Archival photo — never overwritten by non-destructive edits. */
  originalImageId?: string;
  /**
   * Studio Clean display image (framed / compressed).
   * Stored with role "cover" for ZIP v1/v2 compatibility.
   */
  curatedImageId?: string;
  /** Optional AI Curated Cover (role "ai_curated"). Never replaces original. */
  aiCuratedImageId?: string;
  /**
   * Active gallery image id (alias of active cover).
   * Kept for readers that only know coverImageId (VE 2.0 / schema v1).
   */
  coverImageId?: string;
  /** Which photo the gallery should prefer. Defaults to Studio Clean when present. */
  activeCoverType?: ActiveCoverType;
  /** Optional match notes — never treated as verified product identity alone. */
  productMatchNotes?: string;
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
  sourceMeta?: ImageSourceMeta;
  /** Vertical focal point 0–1 used when generating Studio Clean. */
  focalY?: number;
  rotation?: 0 | 90 | 180 | 270;
  /** Present on AI assets — provider id / model / prompt version. */
  generatedBy?: string;
  generationVersion?: string;
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

/** Resolve which stored image id should power Gallery / Grid. */
export function resolveActiveCoverId(item: WardrobeItem): string | undefined {
  const prefer =
    item.activeCoverType ??
    (item.curatedImageId || item.coverImageId ? "curated" : "original");
  if (prefer === "original") {
    return item.originalImageId ?? item.coverImageId;
  }
  if (prefer === "ai") {
    return (
      item.aiCuratedImageId ??
      item.curatedImageId ??
      item.coverImageId ??
      item.originalImageId
    );
  }
  return (
    item.curatedImageId ??
    item.coverImageId ??
    item.originalImageId
  );
}

/** Product label for cover type (UI). */
export function coverTypeLabel(type: ActiveCoverType): string {
  if (type === "original") return "Original";
  if (type === "ai") return "AI Curated";
  return "Studio Clean";
}
