import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterAndSortItems } from "./filter";
import type { DisplayItem, WardrobeFilters } from "./types";

const base: DisplayItem[] = [
  {
    id: "1",
    name: "Camel Coat",
    brand: "Archive",
    category: "outerwear",
    colors: ["Camel"],
    seasons: ["winter"],
    isFavorite: true,
    sortOrder: 1,
    createdAt: "2025-01-02T00:00:00.000Z",
    updatedAt: "2025-01-02T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Silk Blouse",
    brand: "Studio",
    category: "tops",
    colors: ["Ivory"],
    seasons: ["spring"],
    isFavorite: false,
    sortOrder: 2,
    createdAt: "2025-01-03T00:00:00.000Z",
    updatedAt: "2025-01-03T00:00:00.000Z",
  },
];

const filters: WardrobeFilters = {
  query: "",
  category: "all",
  season: "all",
  color: "all",
  favoritesOnly: false,
  sort: "recent",
};

describe("filterAndSortItems", () => {
  it("sorts by recent createdAt", () => {
    const result = filterAndSortItems(base, filters);
    assert.deepEqual(
      result.map((i) => i.id),
      ["2", "1"],
    );
  });

  it("filters favorites and category together", () => {
    const result = filterAndSortItems(base, {
      ...filters,
      favoritesOnly: true,
      category: "outerwear",
    });
    assert.equal(result.length, 1);
    assert.equal(result[0].name, "Camel Coat");
  });

  it("searches brand and name", () => {
    const result = filterAndSortItems(base, { ...filters, query: "studio" });
    assert.equal(result.length, 1);
    assert.equal(result[0].id, "2");
  });
});
