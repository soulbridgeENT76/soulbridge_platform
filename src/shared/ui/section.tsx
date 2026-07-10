import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

export type SectionTone = "paper" | "ink" | "plum" | "mauve";

const toneClasses: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  ink: "bg-ink text-paper",
  plum: "bg-plum-deep text-paper",
  mauve: "bg-mauve text-ink",
};

type SectionProps = {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: ReactNode;
};

/** Full-bleed vertical section with a brand color tone. */
export function Section({ id, tone = "paper", className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-20 md:py-28 lg:py-32", toneClasses[tone], className)}
    >
      {children}
    </section>
  );
}
