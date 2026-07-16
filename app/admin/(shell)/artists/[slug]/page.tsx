import { notFound } from "next/navigation";
import { getArtistBySlug } from "@entities/artist";
import { ArtistForm } from "@views/admin";

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();
  return <ArtistForm initial={artist} />;
}
