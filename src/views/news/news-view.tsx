import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { NewsFilter } from "@features/news-filter";

export function NewsView() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="VIEW ALL NEWS"
        title="소울브릿지ENT의 새로운 소식"
        description="보도자료부터 공지까지 — 소울브릿지ENT의 소식을 가장 먼저 전해드립니다."
      />
      <Container className="py-16 md:py-24">
        <NewsFilter />
      </Container>
    </PageShell>
  );
}
