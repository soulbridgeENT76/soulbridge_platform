import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { ContentFilter } from "@features/content-filter";

export function ContentsView() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="CONTENTS"
        title="이야기를 담아내는 모든 방식"
        description="유튜브 오리지널부터 드라마, 웹툰·웹소설 IP까지 — 소울브릿지ENT가 만드는 콘텐츠를 소개합니다."
      />
      <Container className="py-16 md:py-24">
        <ContentFilter />
      </Container>
    </PageShell>
  );
}
