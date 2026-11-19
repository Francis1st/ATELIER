"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

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

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-[13px] tracking-[0.08em] uppercase transition-colors duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne motion-reduce:active:scale-100";

export function buttonClassName(variant: Variant = "primary", className?: string) {
  return cn(base, styles[variant], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children?: ReactNode;
};

/** Use `href` for navigation — never nest `<Button>` inside `<Link>`. */
export function Button({
  className,
  variant = "primary",
  href,
  children,
  ...props
}: ButtonProps) {
  const cls = buttonClassName(variant, className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
