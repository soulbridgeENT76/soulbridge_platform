// This barrel exports server-only readers (`"use cache"`, the cookie-bearing
// client), so a client component must not import values from it — doing so
// pulls them into the client graph and the build fails. Type-only imports are
// erased and are fine; for the card, import "@entities/artist/ui/artist-card".
export type { Artist, ArtistWork, ArtistSocial } from "./model/types";
export { getArtists, getArtistBySlug, ARTIST_TAG } from "./api/get-artists";
export {
  getArtistsAdmin,
  getArtistBySlugAdmin,
  getArtistPhotoPath,
  createArtist,
  updateArtist,
  setArtistOrder,
  deleteArtist,
  uniqueSlug,
  type ArtistInput,
} from "./api/update-artist";
export { ArtistCard } from "./ui/artist-card";
