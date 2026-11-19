"use client";

import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-charcoal text-ivory hover:bg-charcoal/90 border border-charcoal",
  secondary:
    "bg-transparent text-charcoal border border-border hover:border-charcoal",
  ghost: "bg-transparent text-charcoal hover:text-champagne border-transparent",
  danger:
    "bg-transparent text-red-800 border border-red-200 hover:border-red-400",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] tracking-[0.08em] uppercase transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
