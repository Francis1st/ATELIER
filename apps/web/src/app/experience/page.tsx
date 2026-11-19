import type { Metadata } from "next";
import { ComingToIphone } from "@/components/brand/ComingToIphone";
import { Button } from "@/components/ui/Button";
import { MobilePrimaryBar } from "@/components/layout/MobilePrimaryBar";
import { ExperienceClient } from "@/app/experience/ExperienceClient";

export const metadata: Metadata = {
  title: "Demo Gallery",
  description:
    "Explore the ATELIER Demo Collection — an editorial Gallery and Grid preview, separate from your personal wardrobe.",
};

export default function ExperiencePage() {
  return (
    <>
      <div className="mx-auto max-w-6xl page-pad py-8 pb-28 md:py-16 md:pb-16">
        <div className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between md:gap-6 md:pb-8">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.28em] uppercase text-champagne">
              Demo Collection
            </p>
            <h1 className="mt-3 font-display text-[clamp(1.85rem,7vw,3rem)] text-charcoal">
              The Collection
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-warm-gray md:text-base">
              An editorial preview — sample pieces for browsing only. They never
              mix with your personal wardrobe.
            </p>
          </div>
          <Button
            href="/wardrobe"
            className="hidden w-full shrink-0 sm:w-auto md:inline-flex"
          >
            Start Your Own Wardrobe
          </Button>
        </div>

        <div className="mt-6 md:mt-10">
          <ExperienceClient />
        </div>

        <ComingToIphone className="mt-8" />
      </div>
      <MobilePrimaryBar href="/wardrobe" label="Start Your Own Wardrobe" />
    </>
  );
}
