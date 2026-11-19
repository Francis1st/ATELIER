import type { Metadata } from "next";
import Link from "next/link";
import { ComingToIphone } from "@/components/brand/ComingToIphone";
import { Button } from "@/components/ui/Button";
import { ExperienceClient } from "@/app/experience/ExperienceClient";

export const metadata: Metadata = {
  title: "Demo Gallery",
  description:
    "Explore the ATELIER Demo Collection — an editorial Gallery and Grid preview, separate from your personal wardrobe.",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-champagne">
            Demo Collection
          </p>
          <h1 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
            Experience the gallery
          </h1>
          <p className="mt-3 max-w-xl text-warm-gray">
            These sample pieces are for browsing only. They never mix with your
            personal wardrobe.
          </p>
        </div>
        <Link href="/wardrobe">
          <Button type="button">Start Your Own Wardrobe</Button>
        </Link>
      </div>

      <div className="mt-10">
        <ExperienceClient />
      </div>

      <ComingToIphone className="mt-8" />
    </div>
  );
}
