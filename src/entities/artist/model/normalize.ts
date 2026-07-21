import { mediaUrl } from "@shared/lib/media-url";
import { toSocialKey } from "@shared/config/socials";
import type { Artist } from "./types";

/**
 * One artist plus its two child tables. Postgrest returns the children nested
 * from a single request, so a roster of six costs one round trip, not thirteen.
 *
 * Shared by the cached public reader and the authed admin reader so the two can
 * never disagree about what an artist is.
 */
export const ARTIST_SELECT = `
  id, slug, name, english_name, occupation, description, photo,
  artist_links ( key, href, created_at ),
  artist_careers ( label, description, created_at )
` as const;

export type ArtistRow = {
  id: string;
  slug: string;
  name: string;
  english_name: string;
  occupation: string;
  description: string | null;
  photo: string | null;
  artist_links: { key: string; href: string }[] | null;
  artist_careers: { label: string; description: string }[] | null;
};

/**
 * Maps a row to the shape the UI renders.
 *
 * Read defensively: a link key that predates the shared registry (or was
 * hand-edited) resolves through toSocialKey, and anything it cannot place is
 * dropped rather than rendered as a blank icon slot.
 */
export function toArtist(row: ArtistRow): Artist {
  return {
    id: row.id,
    slug: row.slug,
    nameKo: row.name,
    nameEn: row.english_name,
    role: row.occupation,
    bio: row.description ?? "",
    photo: mediaUrl(row.photo),
    works: (row.artist_careers ?? []).map((c) => ({
      label: c.label,
      description: c.description,
    })),
    socials: (row.artist_links ?? []).flatMap((l) => {
      const key = toSocialKey(l.key);
      return key && l.href ? [{ key, href: l.href }] : [];
    }),
  };
}
