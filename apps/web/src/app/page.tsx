import Link from "next/link";
import { ComingToIphone } from "@/components/brand/ComingToIphone";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/config";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(247,245,240,0.2)_0%,rgba(247,245,240,0.85)_42%,#F7F5F0_100%)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/demo/coat-camel.svg"
            alt=""
            className="h-full w-full object-cover object-[60%_20%] opacity-90"
          />
        </div>

        <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24 md:pt-20">
          <p className="animate-fade-up font-display text-5xl tracking-[0.28em] text-charcoal md:text-7xl">
            {BRAND.name}
          </p>
          <h1 className="animate-fade-up mt-6 max-w-xl font-display text-3xl leading-tight text-charcoal md:text-5xl" style={{ animationDelay: "80ms" }}>
            {BRAND.tagline}
          </h1>
          <p className="animate-fade-up mt-5 max-w-md text-warm-gray leading-relaxed" style={{ animationDelay: "140ms" }}>
            A private visual wardrobe — curated like an editorial gallery, kept
            on your device.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
            <Link href="/experience">
              <Button type="button">Explore the Gallery</Button>
            </Link>
            <Link href="/wardrobe">
              <Button type="button" variant="secondary">
                Create My Wardrobe
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28" aria-labelledby="value-heading">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
            Visual Wardrobe
          </p>
          <h2
            id="value-heading"
            className="mt-4 max-w-2xl font-display text-3xl md:text-4xl text-charcoal"
          >
            Not a closet inventory. A gallery of what you wear.
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Editorial Gallery",
                body: "Asymmetric rhythm, quiet spacing, and garment-first photography — made for lingering, not scanning rows of SKUs.",
              },
              {
                title: "Practical Grid",
                body: "When you need to find something quickly, switch to a clean grid with search, filters, and favorites.",
              },
              {
                title: "Local by design",
                body: "Photos and details stay in this browser. Export a ZIP anytime — no account required for the web experience.",
              },
            ].map((item) => (
              <article key={item.title}>
                <div className="mb-4 h-px w-10 bg-champagne" />
                <h3 className="font-display text-2xl text-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28" aria-labelledby="views-heading">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
              Two ways to see
            </p>
            <h2 id="views-heading" className="mt-4 font-display text-3xl md:text-4xl text-charcoal">
              Gallery for feeling. Grid for finding.
            </h2>
            <p className="mt-5 text-warm-gray leading-relaxed">
              Start with the Demo Collection to feel the editorial layout, then
              create your own wardrobe with real photos from your camera roll.
            </p>
            <Link href="/experience" className="mt-8 inline-block">
              <Button type="button" variant="secondary">
                Open Demo Collection
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demo/dress-midnight.svg" alt="Demo dress plate" className="aspect-[3/4] object-cover bg-[#EFEBE4]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/demo/blouse-ivory.svg" alt="Demo blouse plate" className="mt-8 aspect-[3/4] object-cover bg-[#EFEBE4]" />
          </div>
        </div>
      </section>

      <ComingToIphone />
    </>
  );
}
