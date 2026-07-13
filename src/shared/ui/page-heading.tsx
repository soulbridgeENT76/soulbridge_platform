import type { ReactNode } from "react";
import { Container } from "./container";
import { Eyebrow } from "./eyebrow";

type PageHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional trailing node (e.g. a count or filter row). */
  aside?: ReactNode;
};

/** Standard interior-page hero: eyebrow + large title + optional lede. */
export function PageHeading({ eyebrow, title, description, aside }: PageHeadingProps) {
  return (
    <Container className="pt-16 md:pt-24">
      <Eyebrow className="text-plum">{eyebrow}</Eyebrow>
      <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1 className="max-w-3xl whitespace-pre-line text-4xl/[1.2] font-bold tracking-tight text-ink md:text-5xl/[1.2] lg:text-6xl/[1.2]">
          {title}
        </h1>
        {aside}
      </div>
      {description && (
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink/60 md:text-lg">
          {description}
        </p>
      )}
    </Container>
  );
}
