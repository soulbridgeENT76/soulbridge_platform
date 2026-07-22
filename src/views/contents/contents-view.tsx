import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { getPageCopy, getSectionEyebrow } from "@entities/page-content";
import { getContents, getContentCategories } from "@entities/content";
import { ContentFilter } from "@features/content-filter";

export async function ContentsView() {
  const fallback = PAGE_COPY.contents;
  // Title/description come from the CMS (page_contents); the English eyebrow
  // mirrors the home banner's CTA button for this section (single source).
  const [copy, eyebrow, contents, categories] = await Promise.all([
    getPageCopy("contents"),
    getSectionEyebrow("/contents"),
    getContents(),
    getContentCategories(),
  ]);
  return (
    <PageShell>
      <PageHeading
        eyebrow={eyebrow ?? fallback.eyebrow}
        title={copy?.title ?? fallback.title}
        description={copy?.description ?? fallback.description}
      />
      <Container className="py-16 md:py-24">
        <ContentFilter contents={contents} categories={categories} />
      </Container>
    </PageShell>
  );
}
