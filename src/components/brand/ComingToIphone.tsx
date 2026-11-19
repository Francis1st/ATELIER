"use client";

import { APP_STORE_LIVE, APP_STORE_URL } from "@/lib/config";
import { Button } from "@/components/ui/Button";

export function ComingToIphone({ className = "" }: { className?: string }) {
  return (
    <section
      className={`border-t border-border py-20 md:py-28 ${className}`}
      aria-labelledby="coming-iphone-heading"
    >
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
          Native companion
        </p>
        <h2
          id="coming-iphone-heading"
          className="mt-4 font-display text-3xl md:text-4xl text-charcoal"
        >
          Coming to iPhone
        </h2>
        <p className="mt-5 text-warm-gray leading-relaxed">
          The full ATELIER experience is being crafted as a native SwiftUI app —
          private, tactile, and designed for daily wardrobe rituals. Export your
          web wardrobe anytime and bring it with you when the app arrives.
        </p>
        {APP_STORE_LIVE && APP_STORE_URL ? (
          <a
            href={APP_STORE_URL}
            className="mt-8 inline-flex"
            rel="noopener noreferrer"
          >
            <Button type="button">Download on the App Store</Button>
          </a>
        ) : (
          <p className="mt-8 text-[12px] tracking-[0.18em] uppercase text-champagne">
            App Store link will appear when published
          </p>
        )}
      </div>
    </section>
  );
}
