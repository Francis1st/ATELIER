import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center">
      <p className="font-display text-5xl tracking-[0.2em] text-charcoal">404</p>
      <h1 className="mt-4 font-display text-3xl text-charcoal">Page not found</h1>
      <p className="mt-3 text-warm-gray">
        This path is not part of the ATELIER web experience.
      </p>
      <Button href="/" className="mt-8">
        Back home
      </Button>
    </div>
  );
}
