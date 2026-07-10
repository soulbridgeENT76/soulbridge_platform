import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { NewsFilter } from "@features/news-filter";

export function NewsView() {
  return (
    <PageShell>
      <PageHeading eyebrow="NEWS" title="소울브릿지ENT의 새로운 소식" />
      <Container className="py-16 md:py-24">
        <NewsFilter />
      </Container>
    </PageShell>
  );
}
