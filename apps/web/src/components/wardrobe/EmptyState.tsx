import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  title = "Your wardrobe awaits",
  body = "Add your first piece. Photos stay on this device — no account required.",
  ctaHref = "/wardrobe/new",
  ctaLabel = "Add a piece",
}: {
  title?: string;
  body?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="mb-8 h-px w-16 bg-champagne" />
      <h2 className="font-display text-3xl text-charcoal">{title}</h2>
      <p className="mt-4 text-warm-gray leading-relaxed">{body}</p>
      <Link href={ctaHref} className="mt-8">
        <Button type="button">{ctaLabel}</Button>
      </Link>
    </div>
  );
}
