import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { NewsFilter } from "@features/news-filter";

export function NewsView() {
  const copy = PAGE_COPY.news;
  return (
    <PageShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <Container className="py-16 md:py-24">
        <NewsFilter />
      </Container>
    </PageShell>
  );
}
