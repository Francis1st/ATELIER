import type { Metadata } from "next";
import { Suspense } from "react";
import { EditPageClient } from "@/app/wardrobe/edit/EditPageClient";

export const metadata: Metadata = {
  title: "Edit piece",
  robots: { index: false, follow: false },
};

export default function EditItemPage() {
  return (
    <div className="mx-auto max-w-6xl page-pad py-10 md:py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
        Edit
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.85rem,7vw,2.5rem)] text-charcoal">
        Edit piece
      </h1>
      <div className="mt-8 md:mt-10">
        <Suspense
          fallback={
            <p className="text-sm tracking-[0.14em] uppercase text-warm-gray">
              Loading…
            </p>
          }
        >
          <EditPageClient />
        </Suspense>
      </div>
    </div>
  );
}
