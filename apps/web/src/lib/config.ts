export const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL?.trim() || "";
export const APP_STORE_LIVE =
  process.env.NEXT_PUBLIC_APP_STORE_LIVE === "true" && Boolean(APP_STORE_URL);

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const BRAND = {
  name: "ATELIER",
  tagline: "Your Wardrobe, Curated.",
  product: "Visual Wardrobe",
  heroLine: "A considered space for the pieces you love.",
} as const;
