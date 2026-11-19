import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <p className="font-display tracking-[0.2em] text-charcoal uppercase text-sm">
          ATELIER
        </p>
        <p className="text-sm text-warm-gray max-w-md">
          Your wardrobe stays on this device. Export regularly — clearing browser
          storage removes local pieces.
        </p>
        <div className="flex gap-6 text-[11px] tracking-[0.14em] uppercase text-warm-gray">
          <Link href="/privacy" className="hover:text-charcoal">
            Privacy
          </Link>
          <Link href="/wardrobe" className="hover:text-charcoal">
            My Wardrobe
          </Link>
        </div>
      </div>
    </footer>
  );
}
