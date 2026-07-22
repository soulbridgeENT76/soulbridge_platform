import { PageShell } from "@widgets/page-shell";
import { Container, Eyebrow } from "@shared/ui";

/** A paragraph, or a bulleted list — the two shapes a section is built from. */
export type LegalBlock = { p: string } | { list: string[] };

export type LegalSection = {
  heading: string;
  /** Free-form paragraphs. Newlines render as line breaks. */
  paragraphs?: string[];
  /** Bulleted items rendered below the paragraphs. */
  list?: string[];
  /**
   * Ordered mix of paragraphs and lists, for sections that interleave them
   * (paragraph → list → paragraph). Takes precedence over paragraphs/list.
   */
  blocks?: LegalBlock[];
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  /** e.g. "시행일: 2026년 7월 27일". */
  effectiveDate: string;
  intro?: string;
  sections: LegalSection[];
};

/** Flattens either authoring shape into one ordered block list to render. */
function toBlocks(section: LegalSection): LegalBlock[] {
  if (section.blocks) return section.blocks;
  const blocks: LegalBlock[] = (section.paragraphs ?? []).map((p) => ({ p }));
  if (section.list) blocks.push({ list: section.list });
  return blocks;
}

/**
 * Shared layout for the static legal pages (개인정보처리방침 · 이용약관). Renders a
 * standard interior hero followed by numbered sections in a readable measure.
 */
export function LegalDocument({
  eyebrow,
  title,
  effectiveDate,
  intro,
  sections,
}: LegalDocumentProps) {
  return (
    <PageShell>
      <Container className="pb-20 pt-16 md:pb-28 md:pt-24">
        <Eyebrow className="text-plum">{eyebrow}</Eyebrow>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-ink/45">{effectiveDate}</p>

        {intro && (
          <p className="mt-8 max-w-3xl whitespace-pre-line text-base leading-relaxed text-ink/70">
            {intro}
          </p>
        )}

        <div className="mt-12 flex max-w-3xl flex-col gap-10">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-ink md:text-xl">
                {section.heading}
              </h2>

              {toBlocks(section).map((block, j) =>
                "list" in block ? (
                  <ul key={j} className="mt-3 flex flex-col gap-2">
                    {block.list.map((item, k) => (
                      <li
                        key={k}
                        className="flex gap-2.5 text-sm leading-relaxed text-ink/70 md:text-base"
                      >
                        <span
                          aria-hidden
                          className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-plum/60"
                        />
                        <span className="whitespace-pre-line">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    key={j}
                    className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/70 md:text-base"
                  >
                    {block.p}
                  </p>
                ),
              )}
            </section>
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
