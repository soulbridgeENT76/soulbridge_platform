import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

type EyebrowProps = {
  className?: string;
  children: ReactNode;
};

/** Small uppercase label above headings (e.g. "ABOUT US", "LEADERSHIP"). */
export function Eyebrow({ className, children }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.25em]",
        className
      )}
    >
      <span aria-hidden className="h-px w-6 bg-current opacity-70" />
      {children}
    </span>
  );
}
