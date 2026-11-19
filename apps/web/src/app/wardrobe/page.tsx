import type { Metadata } from "next";
import { ComingToIphone } from "@/components/brand/ComingToIphone";
import { Button } from "@/components/ui/Button";
import { MobilePrimaryBar } from "@/components/layout/MobilePrimaryBar";
import { WardrobeClient } from "@/app/wardrobe/WardrobeClient";

export const metadata: Metadata = {
  title: "My Wardrobe",
  description: "Your private ATELIER wardrobe — stored locally in this browser.",
  robots: { index: false, follow: false },
};

export default function WardrobePage() {
  return (
    <>
      <div className="mx-auto max-w-6xl page-pad py-8 pb-28 md:py-16 md:pb-16">
        <div className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between md:gap-6 md:pb-8">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
              Private · Local
            </p>
            <h1 className="mt-3 font-display text-[clamp(1.85rem,7vw,3rem)] text-charcoal">
              My Wardrobe
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-warm-gray md:text-base">
              Pieces you add are saved in this browser only. Export a backup before
              clearing site data.
            </p>
          </div>
          <Button
            href="/wardrobe/new"
            className="hidden w-full shrink-0 sm:w-auto md:inline-flex"
          >
            Add a piece
          </Button>
        </div>

        <div className="mt-6 md:mt-10">
          <WardrobeClient />
        </div>

        <ComingToIphone className="mt-4" />
      </div>
      <MobilePrimaryBar href="/wardrobe/new" label="Add a piece" />
    </>
  );
}
