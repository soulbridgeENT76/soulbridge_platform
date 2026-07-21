import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@widgets/page-shell";
import { getArtists, getArtistBySlug } from "@entities/artist";
import { ArtistDetailView } from "@views/artists";

type Params = { params: Promise<{ slug: string }> };

/**
 * The roster known at build time. Without this the route's params are unknown,
 * and the page chrome cannot prerender at all: SiteHeader reads usePathname(),
 * which counts as runtime data under cacheComponents and would block the whole
 * route. An artist added later is still reachable — the route renders on demand
 * and is cached under ARTIST_TAG, which the save and delete actions invalidate.
 *
 * cacheComponents also requires at least one result. The roster is CMS-managed
 * and may legitimately be empty, so an empty one falls back to a sentinel slug
 * that simply 404s: returning [] fails the build, which would turn "the
 * operator removed every artist" into a failed deploy.
 */
export async function generateStaticParams() {
  const artists = await getArtists();
  if (artists.length === 0) return [{ slug: "none" }];
  return artists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  return { title: artist ? artist.nameKo : "Artists" };
}

export default async function ArtistDetailPage({ params }: Params) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  return (
    <PageShell>
      <ArtistDetailView artist={artist} />
    </PageShell>
  );
}
