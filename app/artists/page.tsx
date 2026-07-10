import type { Metadata } from "next";
import { ArtistsView } from "@views/artists";

export const metadata: Metadata = { title: "Artists" };

export default function ArtistsPage() {
  return <ArtistsView />;
}
