import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { getPageCopy, getSectionEyebrow } from "@entities/page-content";
import { getPublishedNotices, getNoticeCategories } from "@entities/notices";
import { NoticeFilter } from "@features/notice-filter";

export async function NoticesView() {
  const fallback = PAGE_COPY.news;
  // Title/description come from the CMS (page_contents slug "notice"); the
  // English eyebrow mirrors the home banner's CTA button (single source).
  const [copy, eyebrow, notices, categories] = await Promise.all([
    getPageCopy("notice"),
    getSectionEyebrow("/notice"),
    getPublishedNotices(),
    getNoticeCategories(),
  ]);
  return (
    <PageShell>
      <PageHeading
        eyebrow={eyebrow ?? fallback.eyebrow}
        title={copy?.title ?? fallback.title}
        description={copy?.description ?? fallback.description}
      />
      <Container className="py-16 md:py-24">
        <NoticeFilter notices={notices} categories={categories} />
      </Container>
    </PageShell>
  );
}
