"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/experience", label: "Gallery" },
  { href: "/wardrobe", label: "My Wardrobe" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header
        className="sticky top-0 z-[60] border-b border-border/80 bg-ivory/95 backdrop-blur-sm"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between page-pad sm:h-16">
          <Wordmark className="text-[1.2rem] sm:text-[1.35rem]" />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[12px] tracking-[0.16em] uppercase transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-charcoal"
                    : "text-warm-gray hover:text-charcoal",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="touch-target inline-flex items-center justify-center text-charcoal md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Sibling of sticky header so fixed overlay is not trapped in header stacking context */}
      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-0 z-[55] flex flex-col bg-ivory md:hidden"
          style={{ paddingTop: "calc(3.5rem + var(--safe-top))" }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="flex min-h-0 flex-1 flex-col px-4 pt-4">
            <ul className="flex flex-col">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex min-h-14 items-center border-b border-border text-[15px] tracking-[0.18em] uppercase",
                      pathname.startsWith(link.href)
                        ? "text-charcoal"
                        : "text-warm-gray",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-3 pb-[max(1.5rem,var(--safe-bottom))] pt-10">
              <Link
                href="/experience"
                className="flex min-h-12 items-center justify-center bg-charcoal text-[12px] tracking-[0.14em] uppercase text-ivory"
                onClick={() => setOpen(false)}
              >
                Explore the Gallery
              </Link>
              <Link
                href="/wardrobe"
                className="flex min-h-12 items-center justify-center border border-border text-[12px] tracking-[0.14em] uppercase text-charcoal"
                onClick={() => setOpen(false)}
              >
                Create My Wardrobe
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
