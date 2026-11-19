import type { Metadata } from "next";
import Link from "next/link";
import { ComingToIphone } from "@/components/brand/ComingToIphone";
import { Button } from "@/components/ui/Button";
import { WardrobeClient } from "@/app/wardrobe/WardrobeClient";

export const metadata: Metadata = {
  title: "My Wardrobe",
  description: "Your private ATELIER wardrobe — stored locally in this browser.",
  robots: { index: false, follow: false },
};

export default function WardrobePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
            Private · Local
          </p>
          <h1 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
            My Wardrobe
          </h1>
          <p className="mt-3 max-w-xl text-warm-gray">
            Pieces you add are saved in this browser only. Export a backup before
            clearing site data.
          </p>
        </div>
        <Link href="/wardrobe/new">
          <Button type="button">Add a piece</Button>
        </Link>
      </div>

      <div className="mt-10">
        <WardrobeClient />
      </div>

      <ComingToIphone className="mt-4" />
    </div>
  );
}
