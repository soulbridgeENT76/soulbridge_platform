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
 * Editorial two-column section: a sticky index + heading on the left, content
 * on the right. Keeps the whole ABOUT page reading as a designed spread rather
 * than a stacked list.
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
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,17rem)_1fr] lg:gap-x-20">
          <div className="md:sticky md:top-28 md:self-start">
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
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}
