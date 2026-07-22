import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { getArtists } from "@entities/artist";
import { getPageCopy, getSectionEyebrow } from "@entities/page-content";
import { ArtistGrid } from "./artist-grid";

export async function ArtistsView() {
  const fallback = PAGE_COPY.artists;
  // Pagination is client-side over the full roster, so the whole list is read
  // here — it is one cached query, and the grid needs the total to page at all.
  // Title/description come from the CMS; the English eyebrow mirrors the home
  // banner's CTA button for this section (single source).
  const [copy, artists, eyebrow] = await Promise.all([
    getPageCopy("artists"),
    getArtists(),
    getSectionEyebrow("/artists"),
  ]);

  return (
    <PageShell>
      <PageHeading
        eyebrow={eyebrow ?? fallback.eyebrow}
        title={copy?.title ?? fallback.title}
        description={copy?.description ?? fallback.description}
      />
      <Container className="py-16 md:py-24">
        <ArtistGrid artists={artists} />
      </Container>
    </PageShell>
  );
}
