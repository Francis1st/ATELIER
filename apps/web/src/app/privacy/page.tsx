import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How ATELIER Web handles your photos and wardrobe data on this device.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl page-pad py-12 md:py-24">
      <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
        Privacy
      </p>
      <h1 className="mt-3 font-display text-[clamp(1.85rem,7vw,2.5rem)] text-charcoal">
        What stays on your device
      </h1>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-warm-gray md:mt-10 md:text-base">
        <p>
          ATELIER Web is a local-first experience. When you upload garment
          photos or save wardrobe details, they are stored in this browser using
          IndexedDB on your device. There is no account system and no cloud sync
          in this web MVP.
        </p>
        <p>
          We do not upload your wardrobe photos to an ATELIER server as part of
          the core save flow. Clearing site data, using private browsing with
          storage restrictions, or uninstalling the browser can permanently remove
          your local wardrobe.
        </p>
        <p>
          Use <strong className="font-medium text-charcoal">Export Wardrobe</strong>{" "}
          to download a ZIP backup that includes your item records and images.
          You can import that archive later on this site, or keep it for a future
          native iPhone app restore.
        </p>
        <p>
          This site may load fonts from the network (via Next.js font
          optimization). No third-party analytics scripts are included in this
          MVP. Demo Collection images are original editorial plates created for
          ATELIER, not scraped brand photography. An iPhone waitlist form only
          submits when a waitlist endpoint is configured.
        </p>
        <p>
          This page describes the current web implementation. It is not a legal
          privacy policy for a company entity, and it does not invent contact
          emails or certifications.
        </p>
      </div>
    </article>
  );
}
