import { test, expect } from "@playwright/test";

test("home CTAs and demo gallery", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Your Wardrobe, Curated/i }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Explore the Gallery/i }).click();
  await expect(page).toHaveURL(/\/experience/);
  await expect(page.getByText("Demo Collection").first()).toBeVisible();

  const piece = page.getByRole("button", { name: "Cashmere Column Coat" });
  await piece.scrollIntoViewIfNeeded();
  await piece.click({ force: true });
  await expect(page.getByTestId("item-detail")).toBeVisible({ timeout: 10_000 });
  await expect(
    page.getByRole("heading", { name: "Cashmere Column Coat" }),
  ).toBeVisible();
});

test("wardrobe empty or ready and privacy", async ({ page }) => {
  await page.goto("/wardrobe");
  await expect(page.getByRole("heading", { name: /My Wardrobe/i })).toBeVisible();

  // Storage may be empty, errored, or still warming — all are valid UI paths.
  await expect(
    page
      .getByRole("heading", { name: /Your wardrobe awaits/i })
      .or(page.getByText(/Browser storage is unavailable/i))
      .or(page.getByRole("button", { name: /Export Wardrobe/i })),
  ).toBeVisible({ timeout: 15_000 });

  await page.goto("/privacy");
  await expect(page.getByText(/IndexedDB/i)).toBeVisible();
});
