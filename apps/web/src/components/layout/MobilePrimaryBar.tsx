import { Button } from "@/components/ui/Button";

/** Phone-first sticky action bar — hidden from md and up. */
export function MobilePrimaryBar({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-ivory/95 px-4 pt-3 backdrop-blur-sm md:hidden"
      style={{ paddingBottom: "max(0.75rem, var(--safe-bottom))" }}
    >
      <Button href={href} className="w-full">
        {label}
      </Button>
    </div>
  );
}
