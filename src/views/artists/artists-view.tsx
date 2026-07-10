import { PageShell } from "@widgets/page-shell";
import { Container, Eyebrow, PageHeading } from "@shared/ui";
import { ARTISTS, ArtistCard } from "@entities/artist";

export function ArtistsView() {
  return (
    <PageShell>
      <PageHeading
        eyebrow="ARTIST"
        title="이야기를 전하는 사람들"
        aside={
          <Eyebrow className="text-ink/50">
            TOTAL {String(ARTISTS.length).padStart(2, "0")}
          </Eyebrow>
        }
      />
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-3 xl:grid-cols-4">
          {ARTISTS.map((artist, i) => (
            <ArtistCard key={artist.slug} artist={artist} index={i + 1} />
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
