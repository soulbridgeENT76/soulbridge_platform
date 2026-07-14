import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { ContentFilter } from "@features/content-filter";

export function ContentsView() {
  const copy = PAGE_COPY.contents;
  return (
    <PageShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <Container className="py-16 md:py-24">
        <ContentFilter />
      </Container>
    </PageShell>
  );
}
