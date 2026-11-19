import Link from "next/link";
import { cn } from "@/lib/cn";

export function Wordmark({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "font-display text-[1.35rem] tracking-[0.22em] text-charcoal uppercase",
        className,
      )}
      aria-label="ATELIER home"
    >
      ATELIER
    </Link>
  );
}
