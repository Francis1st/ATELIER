"use client";

import { DEMO_ITEMS } from "@/content/demo-collection";
import { WardrobeBrowser } from "@/components/wardrobe/WardrobeBrowser";

export function ExperienceClient() {
  return <WardrobeBrowser items={DEMO_ITEMS} editable={false} />;
}
