import type { Category } from "@/domain/types";

const CATEGORY_HINT: Record<Category, string> = {
  tops: "top / shirt / blouse garment",
  bottoms: "trousers / skirt garment",
  outerwear: "coat / jacket outerwear",
  dresses: "dress",
  footwear: "footwear",
  bags: "handbag / tote",
  accessories: "fashion accessory",
};

/** Base editorial prompt — adapted per category. Never claims 100% fidelity. */
export function buildCuratedCoverPrompt(input: {
  category: Category;
  colors?: string[];
  name?: string;
}): string {
  const colorLine = input.colors?.length
    ? `User-noted colors: ${input.colors.join(", ")}.`
    : "";
  const nameLine = input.name?.trim()
    ? `Piece name (for context only): ${input.name.trim()}.`
    : "";

  return `Use the uploaded garment photograph as the primary visual reference.

Create a refined, photorealistic editorial studio product image of the exact same ${CATEGORY_HINT[input.category]}.

Preserve its original color, silhouette, proportions, collar, sleeves, seams, pockets, buttons, texture, patterns, logos, and all visible identifying details as faithfully as possible.

Improve only the presentation: use a soft warm-ivory studio background (#F7F5F0 range), natural diffused lighting, subtle realistic shadows, clean composition, and elegant luxury-fashion product photography aesthetics.

Show the full garment without cropping important details.
Do not redesign the garment. Do not add or remove features. Do not invent logos, patterns, labels, accessories, or decorative details.
Do not introduce a model, mannequin, props, text, watermark, or extra clothing items.

${colorLine}
${nameLine}

The result should feel understated, realistic, and consistent with a premium personal wardrobe gallery.`.trim();
}

export const GENERATION_VERSION = "atelier-curated-cover-v1";
