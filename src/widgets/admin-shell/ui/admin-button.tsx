import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@shared/lib/cn";

type Variant = "solid" | "outline" | "ghost";

const VARIANTS: Record<Variant, string> = {
  solid: "bg-brand text-paper hover:bg-brand-soft",
  outline: "border border-ink/20 text-ink hover:border-ink/50",
  ghost: "text-ink/50 hover:bg-ink/5 hover:text-ink",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors";

/** Link styled as an admin button. */
export function AdminLinkButton({
  variant = "solid",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={cn(base, VARIANTS[variant], className)} {...props}>
      {children}
    </Link>
  );
}

/** Native button styled like an admin button (for actions wired later). */
export function AdminButton({
  variant = "solid",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; children: ReactNode }) {
  return (
    <button
      className={cn(base, VARIANTS[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
