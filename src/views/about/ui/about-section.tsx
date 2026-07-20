import type { ReactNode } from "react";
import { Container } from "@shared/ui";

type AboutSectionProps = {
  /** Section index, e.g. "01". */
  index: string;
  /** Uppercase label, e.g. "LEADERSHIP". */
  eyebrow: string;
  /** Optional Korean section title shown under the label. */
  title?: string;
  children: ReactNode;
};

/**
 * Left-aligned editorial section: index + label + title stacked at the top,
 * content below. A consistent left baseline keeps the page easy to scan.
 *
 * Every 2nd section on the page gets a subtle tinted band. This is keyed off
 * DOM position (`nth-of-type`), not the `index` label, so adding or reordering
 * sections keeps the stripe rhythm with no props to maintain.
 */
export function AboutSection({
  index,
  eyebrow,
  title,
  children,
}: AboutSectionProps) {
  return (
    <section className="border-t border-ink/10 [&:nth-of-type(even)]:bg-plum/[0.035]">
      <Container className="py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-black leading-none text-brand md:text-4xl">
              {index}
            </span>
            <span aria-hidden className="h-8 w-0.5 bg-brand/40" />
            <p className="font-display text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">
              {eyebrow}
            </p>
          </div>
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
