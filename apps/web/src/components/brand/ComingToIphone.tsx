"use client";

import { useState, type FormEvent } from "react";
import { APP_STORE_LIVE, APP_STORE_URL } from "@/lib/config";
import { buttonClassName } from "@/components/ui/Button";
import {
  WAITLIST_ENABLED,
  submitWaitlist,
} from "@/lib/waitlist";

export function ComingToIphone({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!WAITLIST_ENABLED) return;
    setStatus("loading");
    setMessage(null);
    const result = await submitWaitlist(email);
    if (result.ok) {
      setStatus("success");
      setMessage("You’re on the list. We’ll be in touch.");
      setEmail("");
      return;
    }
    setStatus("error");
    setMessage(result.error);
  }

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
          className="mt-4 font-display text-[clamp(1.85rem,5vw,2.75rem)] text-charcoal"
        >
          ATELIER for iPhone
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-warm-gray md:text-base">
          Your wardrobe, beautifully at hand — a native SwiftUI companion for
          daily rituals. Export your web wardrobe anytime and bring it with you
          when the app arrives.
        </p>

        {APP_STORE_LIVE && APP_STORE_URL ? (
          <a
            href={APP_STORE_URL}
            className={buttonClassName("primary", "mt-8 w-full sm:w-auto")}
            rel="noopener noreferrer"
          >
            Download on the App Store
          </a>
        ) : WAITLIST_ENABLED ? (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <label className="sr-only" htmlFor="waitlist-email">
              Email for iPhone waitlist
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field flex-1"
              placeholder="Email address"
              disabled={status === "loading" || status === "success"}
            />
            <button
              type="submit"
              className={buttonClassName("primary", "w-full sm:w-auto")}
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? "Joining…" : "Join the Waitlist"}
            </button>
          </form>
        ) : (
          <div className="mx-auto mt-8 max-w-md border border-border px-5 py-6 text-left sm:text-center">
            <p className="text-[11px] tracking-[0.18em] uppercase text-champagne">
              Waitlist
            </p>
            <p className="mt-3 text-sm leading-relaxed text-warm-gray">
              Join the Waitlist opens when our signup service is connected. No
              fake confirmation — we’ll enable it without changing this design.
            </p>
            <p className="mt-4 text-[12px] tracking-[0.14em] uppercase text-warm-gray">
              Coming soon · not open yet
            </p>
          </div>
        )}

        {message ? (
          <p
            className={`mt-4 text-sm ${
              status === "success" ? "text-charcoal" : "text-red-800"
            }`}
            role="status"
          >
            {message}
          </p>
        ) : null}

        <p className="mt-6 text-[12px] leading-relaxed text-warm-gray">
          We only use your email to notify you about the iPhone app. See{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-charcoal">
            Privacy
          </a>
          .
        </p>
      </div>
    </section>
  );
}
