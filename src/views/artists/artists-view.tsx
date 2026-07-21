import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { getArtists } from "@entities/artist";
import { getSectionEyebrow } from "@entities/page-content";
import { ArtistGrid } from "./artist-grid";

export async function ArtistsView() {
  const copy = PAGE_COPY.artists;
  // Pagination is client-side over the full roster, so the whole list is read
  // here — it is one cached query, and the grid needs the total to page at all.
  // The English label mirrors the home banner's CTA button for this section.
  const [artists, eyebrow] = await Promise.all([
    getArtists(),
    getSectionEyebrow("/artists"),
  ]);

  return (
    <PageShell>
      <PageHeading
        eyebrow={eyebrow ?? copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <Container className="py-16 md:py-24">
        <ArtistGrid artists={artists} />
      </Container>
    </PageShell>
  );
}
