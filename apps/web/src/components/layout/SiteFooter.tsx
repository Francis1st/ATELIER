import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-border"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 page-pad py-8 md:flex-row md:items-center md:justify-between md:py-10">
        <p className="font-display tracking-[0.2em] text-charcoal uppercase text-sm">
          ATELIER
        </p>
        <p className="text-sm text-warm-gray max-w-md">
          Your wardrobe stays on this device. Export regularly — clearing browser
          storage removes local pieces.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] tracking-[0.14em] uppercase text-warm-gray">
          <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-charcoal">
            Privacy
          </Link>
          <Link href="/wardrobe" className="inline-flex min-h-11 items-center hover:text-charcoal">
            My Wardrobe
          </Link>
        </div>
      </div>
    </footer>
  );
}
