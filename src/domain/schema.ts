import { z } from "zod";
import { CATEGORIES, SEASONS } from "./types";

export const wardrobeItemInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  brand: z.string().trim().max(80).optional().or(z.literal("")),
  model: z.string().trim().max(80).optional().or(z.literal("")),
  category: z.enum(CATEGORIES),
  subcategory: z.string().trim().max(80).optional().or(z.literal("")),
  colors: z.array(z.string().trim().min(1).max(40)).max(8).default([]),
  seasons: z.array(z.enum(SEASONS)).max(4).default([]),
  material: z.string().trim().max(80).optional().or(z.literal("")),
  purchaseDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v),
      "Use YYYY-MM-DD",
    ),
  purchasePrice: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v, ctx) => {
      if (v === undefined || v === "" || v === null) return undefined;
      const n = typeof v === "number" ? v : Number(v);
      if (!Number.isFinite(n) || n < 0) {
        ctx.addIssue({
          code: "custom",
          message: "Price must be a non-negative number",
        });
        return z.NEVER;
      }
      return Math.round(n * 100) / 100;
    }),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .max(3)
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || /^[A-Z]{3}$/.test(v), "Use a 3-letter currency code"),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  isFavorite: z.boolean().default(false),
});

export type WardrobeItemInput = z.infer<typeof wardrobeItemInputSchema>;

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
