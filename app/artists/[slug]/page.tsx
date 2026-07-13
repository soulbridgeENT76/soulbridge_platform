import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTISTS, getArtistBySlug } from "@entities/artist";
import { ArtistDetailView } from "@views/artists";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTISTS.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  return { title: artist ? artist.nameKo : "Artists" };
}

export default async function ArtistDetailPage({ params }: Params) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();
  return <ArtistDetailView artist={artist} />;
}
