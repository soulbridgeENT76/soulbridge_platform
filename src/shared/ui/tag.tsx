import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

type TagProps = {
  className?: string;
  children: ReactNode;
};

/** Small category/status label (e.g. "YOUTUBE ORIGINAL", "NEWS"). */
export function Tag({ className, children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-display text-[11px] font-semibold uppercase tracking-[0.18em]",
        className
      )}
    >
      {children}
    </span>
  );
}
