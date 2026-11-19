import type { Metadata } from "next";
import { Suspense } from "react";
import { EditItemClient } from "@/app/wardrobe/[id]/edit/EditItemClient";

export const metadata: Metadata = {
  title: "Edit piece",
  robots: { index: false, follow: false },
};

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
        Edit
      </p>
      <h1 className="mt-3 font-display text-4xl text-charcoal">Edit piece</h1>
      <div className="mt-10">
        <Suspense
          fallback={
            <p className="text-sm tracking-[0.14em] uppercase text-warm-gray">
              Loading…
            </p>
          }
        >
          <EditItemLoader params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function EditItemLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditItemClient id={id} />;
}
