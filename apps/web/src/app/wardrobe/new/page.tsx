import type { Metadata } from "next";
import { ItemForm } from "@/components/wardrobe/ItemForm";

export const metadata: Metadata = {
  title: "Add a piece",
  robots: { index: false, follow: false },
};

export default function NewItemPage() {
  return (
    <div className="mx-auto max-w-6xl page-pad py-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
        New piece
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.85rem,7vw,2.5rem)] text-charcoal">
        Add to wardrobe
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-warm-gray md:text-base">
        Upload a photo and a few details. Everything stays on this device until
        you export.
      </p>
      <div className="mt-8 md:mt-10">
        <ItemForm />
      </div>
    </div>
  );
}
