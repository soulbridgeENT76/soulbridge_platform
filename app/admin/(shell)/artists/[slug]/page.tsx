import { notFound } from "next/navigation";
import { getArtistBySlugAdmin } from "@entities/artist";
import { ArtistForm } from "@views/admin";

export default async function EditArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // The authed, uncached read — an edit form has to show what is actually
  // stored, not a cached copy a save may already have superseded.
  const artist = await getArtistBySlugAdmin(slug);
  if (!artist) notFound();
  return <ArtistForm initial={artist} />;
}
