import { chromium, devices } from "@playwright/test";

const base = process.env.BASE_URL || "http://localhost:3000";
const phone = devices["iPhone 13"];
const bugs = [];

const browser = await chromium.launch();
const context = await browser.newContext({
  ...phone,
  locale: "en-US",
});
const page = await context.newPage();
page.on("pageerror", (e) => bugs.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() !== "error") return;
  // Static `serve` has no Next RSC flight handlers; soft-nav 404 noise is expected.
  if (m.text().includes("__next.") || m.text().includes("status of 404")) return;
  bugs.push(`console: ${m.text()}`);
});
page.on("response", (r) => {
  if (r.status() < 400) return;
  const url = r.url();
  if (url.includes("__next.") || url.includes("_rsc=")) return;
  bugs.push(`http ${r.status()}: ${url}`);
});

async function checkOverflow(label) {
  const data = await page.evaluate(() => ({
    w: window.innerWidth,
    sw: document.documentElement.scrollWidth,
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  if (data.overflowX) bugs.push(`${label}: horizontal overflow (${data.sw}>${data.w})`);
  return data;
}

// Home
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await checkOverflow("home");
{
  const vh = page.viewportSize()?.height ?? 0;
  const cta = await page.getByRole("link", { name: "Explore the Gallery" }).first().boundingBox();
  if (!cta || cta.y + cta.height > vh + 8) {
    bugs.push("home: primary CTA below first viewport");
  }
}
await page.getByRole("button", { name: "Open menu" }).click();
const menu = page.getByRole("dialog", { name: "Mobile navigation" });
try {
  await menu.waitFor({ state: "visible", timeout: 5000 });
} catch {
  bugs.push("home: mobile menu not visible");
}
if (await menu.isVisible()) {
  const menuBox = await menu.boundingBox();
  const vw = page.viewportSize()?.width ?? 0;
  if (menuBox && Math.abs(menuBox.width - vw) > 2) {
    bugs.push(`home: menu width ${menuBox.width} != viewport ${vw}`);
  }
  const blocked = await page.evaluate(() => {
    const nav = document.getElementById("mobile-nav");
    if (!nav) return false;
    const r = nav.getBoundingClientRect();
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + 120);
    return nav.contains(el);
  });
  if (!blocked) bugs.push("home: menu does not cover page content (elementFromPoint)");
  await page.getByRole("button", { name: "Close menu" }).click();
}

// Hero CTA must navigate (no nested button-inside-link)
await page.getByRole("link", { name: "Explore the Gallery" }).first().click();
await page.waitForURL("**/experience", { timeout: 8000 }).catch(() => {
  bugs.push("home: Explore the Gallery did not navigate");
});
await page.goto(base + "/", { waitUntil: "networkidle" });

// Experience
await page.goto(base + "/experience", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await checkOverflow("experience");
const filters = page.getByRole("button", { name: /^Filters/i });
if (!(await filters.isVisible())) bugs.push("experience: Filters toggle missing");
// Gallery should be in DOM without expanding filters
if ((await page.getByRole("button", { name: "Cashmere Column Coat" }).count()) < 1) {
  bugs.push("experience: gallery items missing");
}
await page.getByRole("button", { name: "Cashmere Column Coat" }).click();
await page.waitForTimeout(400);
if (!(await page.getByTestId("item-detail").isVisible())) {
  bugs.push("experience: item detail did not open");
} else {
  await page.getByRole("button", { name: "Close" }).click();
}
const stickyCta = page.getByRole("link", { name: "Start Your Own Wardrobe" }).last();
if (!(await stickyCta.isVisible())) bugs.push("experience: sticky CTA missing");
else {
  await stickyCta.click();
  await page.waitForURL("**/wardrobe", { timeout: 8000 }).catch(() => {
    bugs.push("experience: sticky CTA did not navigate");
  });
}

// Wardrobe
await page.goto(base + "/wardrobe", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await checkOverflow("wardrobe");
if (!(await page.getByRole("heading", { name: /My Wardrobe/i }).isVisible())) {
  bugs.push("wardrobe: heading missing");
}
const addCta = page.getByRole("link", { name: "Add a piece" }).last();
if (!(await addCta.isVisible())) {
  bugs.push("wardrobe: Add a piece CTA missing");
} else {
  await addCta.click();
  await page.waitForURL("**/wardrobe/new", { timeout: 8000 }).catch(() => {
    bugs.push("wardrobe: Add a piece did not navigate");
  });
}

// New form
await page.goto(base + "/wardrobe/new", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await checkOverflow("new");
if (!(await page.getByText(/Tap to photograph|Drop a photo/i).first().isVisible())) {
  bugs.push("new: uploader copy missing");
}

console.log(JSON.stringify({ viewport: page.viewportSize(), bugs }, null, 2));
await browser.close();
process.exit(bugs.length ? 1 : 0);
