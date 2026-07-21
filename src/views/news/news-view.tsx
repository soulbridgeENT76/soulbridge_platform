import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { getSectionEyebrow } from "@entities/page-content";
import { NewsFilter } from "@features/news-filter";

export async function NewsView() {
  const copy = PAGE_COPY.news;
  // The English label mirrors the home banner's CTA button for this section.
  const eyebrow = await getSectionEyebrow("/notice");
  return (
    <PageShell>
      <PageHeading
        eyebrow={eyebrow ?? copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <Container className="py-16 md:py-24">
        <NewsFilter />
      </Container>
    </PageShell>
  );
}
