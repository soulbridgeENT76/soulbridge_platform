import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { getSectionEyebrow } from "@entities/page-content";
import { getPublishedNotices, getNoticeCategories } from "@entities/notices";
import { NoticeFilter } from "@features/notice-filter";

export async function NoticesView() {
  const copy = PAGE_COPY.news;
  // The English label mirrors the home banner's CTA button for this section.
  const [eyebrow, notices, categories] = await Promise.all([
    getSectionEyebrow("/notice"),
    getPublishedNotices(),
    getNoticeCategories(),
  ]);
  return (
    <PageShell>
      <PageHeading
        eyebrow={eyebrow ?? copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <Container className="py-16 md:py-24">
        <NoticeFilter notices={notices} categories={categories} />
      </Container>
    </PageShell>
  );
}
