import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@shared/lib/cn";

type ArrowLinkProps = ComponentProps<typeof Link> & {
  children: ReactNode;
  /** Visual emphasis: "solid" pill button vs inline text link. */
  variant?: "solid" | "text";
};

/** Call-to-action link with a trailing arrow (design uses these throughout). */
export function ArrowLink({
  children,
  variant = "text",
  className,
  ...props
}: ArrowLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "group inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.15em] transition-colors",
        variant === "solid" &&
          "rounded-full bg-ink px-6 py-3 text-paper hover:bg-plum-deep",
        variant === "text" && "hover:opacity-60",
        className
      )}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
