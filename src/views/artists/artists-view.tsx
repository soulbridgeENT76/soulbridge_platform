import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { PAGE_COPY } from "@shared/config/page-copy";
import { ArtistGrid } from "./artist-grid";

export function ArtistsView() {
  const copy = PAGE_COPY.artists;
  return (
    <PageShell>
      <PageHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <Container className="py-16 md:py-24">
        <ArtistGrid />
      </Container>
    </PageShell>
  );
}
