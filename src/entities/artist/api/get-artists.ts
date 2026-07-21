import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { ARTIST_SELECT, toArtist, type ArtistRow } from "../model/normalize";
import type { Artist } from "../model/types";

/** Invalidated by the artist save/delete actions via updateTag(). */
export const ARTIST_TAG = "artists";

/**
 * The public roster, in display order.
 *
 * Cached under one tag and cookie-free for the same reasons as the brand and
 * page-content readers: reading cookies inside `"use cache"` throws and would
 * strip prerendering from every artist page. The save/delete actions invalidate
 * ARTIST_TAG, and cacheLife is bounded so a write the tag missed still heals.
 *
 * Children are ordered in the query rather than after the fact — without an
 * explicit order Postgres may return them in any sequence, which would let a
 * career list reshuffle itself between requests.
 */
export async function getArtists(): Promise<Artist[]> {
  "use cache";
  cacheTag(ARTIST_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("artists")
      .select(ARTIST_SELECT)
      // sort_order is the grid order, set by the admin's move controls; a new
      // artist gets the next value, so it starts at the end.
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true, referencedTable: "artist_links" })
      .order("created_at", {
        ascending: true,
        referencedTable: "artist_careers",
      });

    // Degrade to an empty roster rather than 500-ing the page — and rather than
    // failing `next build`, which prerenders these routes with no database.
    if (error || !data) return [];
    return (data as unknown as ArtistRow[]).map(toArtist);
  } catch {
    return [];
  }
}

/** One artist by slug, or null. Shares the roster's single cache entry. */
export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const artists = await getArtists();
  return artists.find((a) => a.slug === slug) ?? null;
}
