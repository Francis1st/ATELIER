import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { wardrobeItemInputSchema } from "./schema";

describe("wardrobeItemInputSchema", () => {
  it("requires a name", () => {
    const result = wardrobeItemInputSchema.safeParse({
      name: "",
      category: "tops",
      colors: [],
      seasons: [],
      isFavorite: false,
    });
    assert.equal(result.success, false);
  });

  it("rejects negative prices", () => {
    const result = wardrobeItemInputSchema.safeParse({
      name: "Coat",
      category: "outerwear",
      colors: [],
      seasons: [],
      isFavorite: false,
      purchasePrice: -10,
    });
    assert.equal(result.success, false);
  });

  it("accepts a valid piece", () => {
    const result = wardrobeItemInputSchema.safeParse({
      name: "Coat",
      category: "outerwear",
      colors: ["Camel"],
      seasons: ["winter"],
      isFavorite: true,
      purchasePrice: "120.5",
      currency: "usd",
    });
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.purchasePrice, 120.5);
      assert.equal(result.data.currency, "USD");
    }
  });
});
