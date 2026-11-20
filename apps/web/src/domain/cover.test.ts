import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  coverTypeLabel,
  resolveActiveCoverId,
  type WardrobeItem,
} from "./types";
import { normalizeImportedItem } from "@/services/wardrobe/repository";

function base(partial: Partial<WardrobeItem> = {}): WardrobeItem {
  return {
    id: "item-1",
    name: "Coat",
    category: "outerwear",
    colors: [],
    seasons: [],
    isFavorite: false,
    sortOrder: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

describe("resolveActiveCoverId", () => {
  it("prefers original when selected", () => {
    const id = resolveActiveCoverId(
      base({
        originalImageId: "orig",
        curatedImageId: "studio",
        coverImageId: "studio",
        activeCoverType: "original",
      }),
    );
    assert.equal(id, "orig");
  });

  it("falls back from AI to studio when AI missing", () => {
    const id = resolveActiveCoverId(
      base({
        originalImageId: "orig",
        curatedImageId: "studio",
        activeCoverType: "ai",
      }),
    );
    assert.equal(id, "studio");
  });

  it("uses AI asset when present", () => {
    const id = resolveActiveCoverId(
      base({
        originalImageId: "orig",
        curatedImageId: "studio",
        aiCuratedImageId: "ai",
        activeCoverType: "ai",
      }),
    );
    assert.equal(id, "ai");
  });
});

describe("normalizeImportedItem", () => {
  it("downgrades AI active cover without AI asset", () => {
    const item = normalizeImportedItem(
      base({
        originalImageId: "orig",
        curatedImageId: "studio",
        activeCoverType: "ai",
      }),
    );
    assert.equal(item.activeCoverType, "curated");
    assert.equal(item.coverImageId, "studio");
  });
});

describe("coverTypeLabel", () => {
  it("maps curated to Studio Clean", () => {
    assert.equal(coverTypeLabel("curated"), "Studio Clean");
    assert.equal(coverTypeLabel("ai"), "AI Curated");
  });
});
