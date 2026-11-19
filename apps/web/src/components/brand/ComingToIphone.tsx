"use client";

import { APP_STORE_LIVE, APP_STORE_URL } from "@/lib/config";
import { buttonClassName } from "@/components/ui/Button";

export function ComingToIphone({ className = "" }: { className?: string }) {
  return (
    <section
      className={`border-t border-border py-16 md:py-28 ${className}`}
      aria-labelledby="coming-iphone-heading"
    >
      <div className="mx-auto max-w-3xl page-pad text-center sm:px-6">
        <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
          Native companion
        </p>
        <h2
          id="coming-iphone-heading"
          className="mt-4 font-display text-[clamp(1.75rem,5vw,2.25rem)] text-charcoal md:text-4xl"
        >
          Coming to iPhone
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-warm-gray md:text-base">
          The full ATELIER experience is being crafted as a native SwiftUI app —
          private, tactile, and designed for daily wardrobe rituals. Export your
          web wardrobe anytime and bring it with you when the app arrives.
        </p>
        {APP_STORE_LIVE && APP_STORE_URL ? (
          <a
            href={APP_STORE_URL}
            className={buttonClassName("primary", "mt-8 w-full sm:w-auto")}
            rel="noopener noreferrer"
          >
            Download on the App Store
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
