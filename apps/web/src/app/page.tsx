import { ComingToIphone } from "@/components/brand/ComingToIphone";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/config";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — asymmetric editorial */}
      <section className="relative border-b border-border" aria-label="Brand">
        <div className="mx-auto grid max-w-6xl md:grid-cols-12 md:items-stretch">
          {/* Mobile: copy first so brand + CTA fit the opening viewport */}
          <div className="order-1 flex flex-col justify-center page-pad py-10 md:order-1 md:col-span-5 md:py-20 lg:py-28">
            <p className="animate-fade-up text-[11px] tracking-[0.32em] uppercase text-warm-gray">
              {BRAND.name}
            </p>
            <h1
              className="animate-fade-up mt-4 font-display text-[clamp(2.2rem,7.5vw,3.75rem)] leading-[1.05] tracking-[0.04em] text-charcoal md:mt-5"
              style={{ animationDelay: "70ms" }}
            >
              {BRAND.tagline}
            </h1>
            <p
              className="animate-fade-up mt-4 max-w-sm text-[15px] leading-relaxed text-warm-gray md:mt-5 md:text-base"
              style={{ animationDelay: "120ms" }}
            >
              {BRAND.heroLine}
            </p>
            <div
              className="animate-fade-up mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row md:mt-9"
              style={{ animationDelay: "180ms" }}
            >
              <Button href="/experience" className="w-full sm:w-auto">
                Explore the Gallery
              </Button>
              <Button
                href="/wardrobe"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Create My Wardrobe
              </Button>
            </div>
          </div>
          <div className="order-2 relative aspect-[4/5] w-full md:order-2 md:col-span-7 md:aspect-auto md:min-h-[min(88vh,46rem)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/coat-camel.jpg"
              alt="Cashmere column coat from the ATELIER Demo Collection"
              className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* 2. The Collection */}
      <section
        className="border-b border-border py-16 md:py-24"
        aria-labelledby="collection-heading"
      >
        <div className="mx-auto max-w-6xl page-pad">
          <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
            The Collection
          </p>
          <h2
            id="collection-heading"
            className="mt-4 max-w-xl font-display text-[clamp(1.75rem,5vw,2.5rem)] text-charcoal"
          >
            A wardrobe that looks like a lookbook.
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:mt-14 md:grid-cols-12 md:gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/demo/dress-midnight.jpg"
              alt="Midnight slip dress"
              className="col-span-2 aspect-[3/4] w-full object-cover md:col-span-7 md:aspect-[4/5]"
              loading="lazy"
            />
            <div className="col-span-2 grid grid-cols-2 gap-2 sm:gap-3 md:col-span-5 md:grid-cols-1 md:gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demo/blouse-ivory.jpg"
                alt="Ivory silk blouse"
                className="aspect-[3/4] w-full object-cover md:aspect-[4/5]"
                loading="lazy"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/demo/loafer-brown.jpg"
                alt="Leather loafers"
                className="aspect-[3/4] w-full object-cover md:mt-8 md:aspect-[4/5]"
                loading="lazy"
              />
            </div>
          </div>
          <div className="mt-8">
            <Button href="/experience" variant="secondary">
              Open Demo Collection
            </Button>
          </div>
        </div>
      </section>

      {/* 3. A More Considered Wardrobe */}
      <section
        className="border-b border-border py-16 md:py-28"
        aria-labelledby="considered-heading"
      >
        <div className="mx-auto max-w-6xl page-pad md:grid md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
              A more considered wardrobe
            </p>
            <h2
              id="considered-heading"
              className="mt-4 font-display text-[clamp(1.75rem,5vw,2.5rem)] text-charcoal"
            >
              Not inventory. Atmosphere.
            </h2>
          </div>
          <div className="mt-8 space-y-8 md:col-span-6 md:col-start-7 md:mt-2">
            <p className="text-[15px] leading-relaxed text-warm-gray md:text-base">
              ATELIER treats each piece as an editorial subject — silhouette,
              cloth, and light — so browsing feels closer to a private gallery
              than a spreadsheet of SKUs.
            </p>
            <p className="text-[15px] leading-relaxed text-warm-gray md:text-base">
              Keep only what you wear. See it with enough space to remember why
              you chose it.
            </p>
          </div>
        </div>
      </section>

      {/* 3b. Curated Cover */}
      <section
        className="border-b border-border py-16 md:py-28"
        aria-labelledby="cover-heading"
      >
        <div className="mx-auto max-w-6xl page-pad md:grid md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
              Curated Cover
            </p>
            <h2
              id="cover-heading"
              className="mt-4 font-display text-[clamp(1.75rem,5vw,2.5rem)] text-charcoal"
            >
              Your photo. Three ways to present it.
            </h2>
          </div>
          <div className="mt-8 space-y-6 md:col-span-6 md:col-start-7 md:mt-2">
            <p className="text-[15px] leading-relaxed text-warm-gray md:text-base">
              <span className="text-charcoal">Original</span> stays untouched.{" "}
              <span className="text-charcoal">Studio Clean</span> frames and
              softens presentation on this device — no cloud model.{" "}
              <span className="text-charcoal">AI Curated</span> is optional,
              consent-based image editing when a secure endpoint is connected.
              Demo Collection images above are editorial plates, not AI outputs
              from user photos.
            </p>
            <Button href="/wardrobe/new" variant="secondary">
              Add a piece
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Gallery / Grid */}
      <section
        className="border-b border-border py-16 md:py-28"
        aria-labelledby="modes-heading"
      >
        <div className="mx-auto max-w-6xl page-pad">
          <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
            Two ways to see
          </p>
          <h2
            id="modes-heading"
            className="mt-4 max-w-2xl font-display text-[clamp(1.75rem,5vw,2.5rem)] text-charcoal"
          >
            Gallery for feeling. Grid for finding.
          </h2>
          <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-16">
            <article>
              <div className="mb-5 h-px w-12 bg-champagne" />
              <h3 className="font-display text-2xl text-charcoal">Gallery</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-warm-gray">
                Asymmetric rhythm and garment-first photography — made for
                lingering, not scanning rows.
              </p>
            </article>
            <article>
              <div className="mb-5 h-px w-12 bg-champagne" />
              <h3 className="font-display text-2xl text-charcoal">Grid</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-warm-gray">
                Search, filter, and favorites when you need something quickly —
                same pieces, clearer path.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 5. Local-First */}
      <section
        className="border-b border-border py-16 md:py-28"
        aria-labelledby="local-heading"
      >
        <div className="mx-auto max-w-3xl page-pad text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-warm-gray">
            Your wardrobe, your rules
          </p>
          <h2
            id="local-heading"
            className="mt-4 font-display text-[clamp(1.85rem,5vw,2.75rem)] text-charcoal"
          >
            Your wardrobe. Your photos. Yours to keep.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-warm-gray md:text-base">
            No account required for the web experience. Pieces stay in this
            browser. Export a ZIP anytime — clearing site data can remove them,
            so keep a backup of what matters.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/wardrobe">Start My Wardrobe</Button>
            <Button href="/privacy" variant="ghost">
              Read how data stays local
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Coming to iPhone */}
      <ComingToIphone />
    </>
  );
}
