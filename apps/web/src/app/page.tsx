import { ComingToIphone } from "@/components/brand/ComingToIphone";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/config";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,245,240,0.35)_0%,rgba(247,245,240,0.88)_48%,#F7F5F0_100%)] md:bg-[linear-gradient(105deg,rgba(247,245,240,0.2)_0%,rgba(247,245,240,0.85)_42%,#F7F5F0_100%)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/demo/coat-camel.svg"
            alt=""
            className="h-full w-full object-cover object-[55%_18%] opacity-90"
          />
        </div>

        <div className="mx-auto flex min-h-[min(92svh,56rem)] max-w-6xl flex-col justify-end page-pad pb-[max(4rem,env(safe-area-inset-bottom))] pt-24 md:min-h-[88vh] md:justify-center md:pb-24 md:pt-20">
          <p className="animate-fade-up font-display text-[clamp(2.4rem,11vw,4.5rem)] tracking-[0.18em] text-charcoal sm:tracking-[0.22em] md:tracking-[0.28em]">
            {BRAND.name}
          </p>
          <h1
            className="animate-fade-up mt-5 max-w-xl font-display text-[clamp(1.75rem,6.5vw,3rem)] leading-tight text-charcoal md:mt-6"
            style={{ animationDelay: "80ms" }}
          >
            {BRAND.tagline}
          </h1>
          <p
            className="animate-fade-up mt-4 max-w-md text-[15px] leading-relaxed text-warm-gray md:mt-5 md:text-base"
            style={{ animationDelay: "140ms" }}
          >
            A private visual wardrobe — curated like an editorial gallery, kept
            on your device.
          </p>
          <div
            className="animate-fade-up mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap"
            style={{ animationDelay: "200ms" }}
          >
            <Button href="/experience" className="w-full sm:w-auto">
              Explore the Gallery
            </Button>
            <Button href="/wardrobe" variant="secondary" className="w-full sm:w-auto">
              Create My Wardrobe
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-28" aria-labelledby="value-heading">
        <div className="mx-auto max-w-6xl page-pad">
          <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
            Visual Wardrobe
          </p>
          <h2
            id="value-heading"
            className="mt-4 max-w-2xl font-display text-[clamp(1.75rem,5vw,2.25rem)] text-charcoal md:text-4xl"
          >
            Not a closet inventory. A gallery of what you wear.
          </h2>
          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3">
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

      <section className="border-t border-border py-16 md:py-28" aria-labelledby="views-heading">
        <div className="mx-auto grid max-w-6xl items-center gap-10 page-pad md:grid-cols-2 md:gap-12">
          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
              Two ways to see
            </p>
            <h2
              id="views-heading"
              className="mt-4 font-display text-[clamp(1.75rem,5vw,2.25rem)] text-charcoal md:text-4xl"
            >
              Gallery for feeling. Grid for finding.
            </h2>
            <p className="mt-5 text-warm-gray leading-relaxed">
              Start with the Demo Collection to feel the editorial layout, then
              create your own wardrobe with real photos from your camera roll.
            </p>
            <Button
              href="/experience"
              variant="secondary"
              className="mt-8 w-full sm:w-auto"
            >
              Open Demo Collection
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/dress-midnight.svg"
              alt="Demo dress plate"
              className="aspect-[3/4] w-full bg-[#EFEBE4] object-cover"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/blouse-ivory.svg"
              alt="Demo blouse plate"
              className="mt-6 aspect-[3/4] w-full bg-[#EFEBE4] object-cover sm:mt-8"
            />
          </div>
        </div>
      </section>

      <ComingToIphone />
    </>
  );
}
