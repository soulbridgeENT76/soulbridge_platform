import type { ReactNode } from "react";
import { Container } from "@shared/ui";
import { cn } from "@shared/lib/cn";

type AboutSectionProps = {
  /** Section index, e.g. "01". */
  index: string;
  /** Uppercase label, e.g. "LEADERSHIP". */
  eyebrow: string;
  /** Optional Korean section title shown under the label. */
  title?: string;
  /** Subtle background band for rhythm (never dark). */
  tinted?: boolean;
  children: ReactNode;
};

/**
 * Left-aligned editorial section: index + label + title stacked at the top,
 * content below. A consistent left baseline keeps the page easy to scan.
 */
export function AboutSection({
  index,
  eyebrow,
  title,
  tinted,
  children,
}: AboutSectionProps) {
  return (
    <section
      className={cn("border-t border-ink/10", tinted && "bg-plum/[0.035]")}
    >
      <Container className="py-16 md:py-24">
        <div className="max-w-2xl">
          <span className="font-display text-sm font-bold tracking-[0.2em] text-plum">
            {index}
          </span>
          <p className="mt-3 font-display text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">
            {eyebrow}
          </p>
          {title && (
            <h2 className="mt-4 text-2xl font-bold leading-snug text-ink md:text-3xl">
              {title}
            </h2>
          )}
        </div>
        <div className="mt-12 md:mt-14">{children}</div>
      </Container>
    </section>
  );
}
