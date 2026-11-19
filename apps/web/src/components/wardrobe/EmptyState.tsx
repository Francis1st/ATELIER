import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function EmptyState({
  title = "Your wardrobe awaits",
  body = "Add your first piece. Photos stay on this device — no account required.",
  ctaHref = "/wardrobe/new",
  ctaLabel = "Add a piece",
  /** Hide inline CTA on small screens when a sticky mobile bar already provides it. */
  deferCtaToMobileBar = false,
}: {
  title?: string;
  body?: string;
  ctaHref?: string;
  ctaLabel?: string;
  deferCtaToMobileBar?: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-1 py-16 text-center sm:py-24">
      <div className="mb-8 h-px w-16 bg-champagne" />
      <h2 className="font-display text-[clamp(1.6rem,6vw,1.875rem)] text-charcoal">
        {title}
      </h2>
      <p className="mt-4 text-[15px] leading-relaxed text-warm-gray md:text-base">
        {body}
      </p>
      <Button
        href={ctaHref}
        className={cn(
          "mt-8 w-full sm:w-auto",
          deferCtaToMobileBar && "hidden md:inline-flex",
        )}
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
