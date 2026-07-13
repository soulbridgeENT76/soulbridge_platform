import { PageShell } from "@widgets/page-shell";
import { Container, Eyebrow, PageHeading } from "@shared/ui";
import { ARTISTS } from "@entities/artist";
import { ArtistGrid } from "./artist-grid";

export function ArtistsView() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="ARTIST"
        title="이야기를 전하는 사람들"
        description="방송인부터 배우, 크리에이터까지 — 소울브릿지ENT와 함께 진심을 전하는 아티스트를 소개합니다."
        aside={
          <Eyebrow className="text-ink/50">
            TOTAL {String(ARTISTS.length).padStart(2, "0")}
          </Eyebrow>
        }
      />
      <Container className="py-16 md:py-24">
        <ArtistGrid />
      </Container>
    </PageShell>
  );
}
