import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { getSectionEyebrow } from "@entities/page-content";
import { getContents, getContentCategories } from "@entities/content";
import { ContentFilter } from "@features/content-filter";

export async function ContentsView() {
  const copy = PAGE_COPY.contents;
  // The English label mirrors the home banner's CTA button for this section.
  const [eyebrow, contents, categories] = await Promise.all([
    getSectionEyebrow("/contents"),
    getContents(),
    getContentCategories(),
  ]);
  return (
    <PageShell>
      <PageHeading
        eyebrow={eyebrow ?? copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <Container className="py-16 md:py-24">
        <ContentFilter contents={contents} categories={categories} />
      </Container>
    </PageShell>
  );
}
