import Link from "next/link";

export function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-border"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 page-pad py-10 md:flex-row md:items-start md:justify-between md:py-14">
        <div>
          <p className="font-display tracking-[0.22em] text-charcoal uppercase text-sm">
            ATELIER
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-warm-gray">
            Your wardrobe. Your photos. Yours to keep. Export regularly —
            clearing browser storage removes local pieces.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] tracking-[0.14em] uppercase text-warm-gray">
          <Link
            href="/experience"
            className="inline-flex min-h-11 items-center hover:text-charcoal"
          >
            Gallery
          </Link>
          <Link
            href="/wardrobe"
            className="inline-flex min-h-11 items-center hover:text-charcoal"
          >
            My Wardrobe
          </Link>
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center hover:text-charcoal"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
