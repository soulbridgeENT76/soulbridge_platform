import { createClient } from "@/lib/supabase/server";
import { ARTIST_SELECT, toArtist, type ArtistRow } from "../model/normalize";
import type { Artist, ArtistSocial, ArtistWork } from "../model/types";

/**
 * Server-only. Deliberately not a server action: "use server" would export
 * these as public HTTP endpoints, so a browser could call them straight past
 * any auth check. The action in the features layer owns that check and calls
 * these — the same split as entities/brand and entities/page-content.
 */

/** The editable fields. `photo` is a Storage path, not a URL. */
export type ArtistInput = {
  slug: string;
  nameKo: string;
  nameEn: string;
  role: string;
  bio: string;
  photo: string | null;
  works: ArtistWork[];
  socials: ArtistSocial[];
};

/** Reads the full roster for the admin list — authed, uncached. */
export async function getArtistsAdmin(): Promise<Artist[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artists")
    .select(ARTIST_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true, referencedTable: "artist_links" })
    .order("created_at", {
      ascending: true,
      referencedTable: "artist_careers",
    });
  if (error || !data) return [];

  return (data as unknown as ArtistRow[]).map(toArtist);
}

/** One artist for the edit form — authed, uncached, so it is never stale. */
export async function getArtistBySlugAdmin(
  slug: string
): Promise<Artist | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artists")
    .select(ARTIST_SELECT)
    .eq("slug", slug)
    .order("created_at", { ascending: true, referencedTable: "artist_links" })
    .order("created_at", {
      ascending: true,
      referencedTable: "artist_careers",
    })
    .single();
  if (error || !data) return null;

  return toArtist(data as unknown as ArtistRow);
}

/** The stored Storage path for an artist, so a caller can clean up the old file. */
export async function getArtistPhotoPath(id: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("artists")
    .select("photo")
    .eq("id", id)
    .single();
  return (data?.photo as string | null) ?? null;
}

/**
 * Replaces an artist's children.
 *
 * Delete-then-insert rather than a diff: the rows carry no stable identity of
 * their own (two careers can share a label), so there is nothing to match on.
 * The lists are short and rewritten wholesale by the form anyway.
 */
async function replaceChildren(
  artistId: string,
  works: ArtistWork[],
  socials: ArtistSocial[]
) {
  const supabase = await createClient();

  await supabase.from("artist_careers").delete().eq("artist_id", artistId);
  await supabase.from("artist_links").delete().eq("artist_id", artistId);

  if (works.length > 0) {
    const { error } = await supabase.from("artist_careers").insert(
      works.map((w) => ({
        artist_id: artistId,
        label: w.label,
        description: w.description,
      }))
    );
    if (error) throw error;
  }

  if (socials.length > 0) {
    const { error } = await supabase.from("artist_links").insert(
      socials.map((s) => ({ artist_id: artistId, key: s.key, href: s.href }))
    );
    if (error) throw error;
  }
}

/** Inserts an artist and its children. Returns the new slug. */
export async function createArtist(input: ArtistInput): Promise<string> {
  const supabase = await createClient();

  // Append to the end of the grid. Reading the current max rather than counting
  // rows keeps it correct after deletes, which would otherwise reuse a value.
  const { data: last } = await supabase
    .from("artists")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = ((last?.sort_order as number | undefined) ?? 0) + 1;

  const { data, error } = await supabase
    .from("artists")
    .insert({
      slug: input.slug,
      name: input.nameKo,
      english_name: input.nameEn,
      occupation: input.role,
      description: input.bio,
      photo: input.photo,
      sort_order: nextOrder,
    })
    .select("id, slug")
    .single();
  if (error || !data) throw error ?? new Error("insert failed");

  await replaceChildren(data.id as string, input.works, input.socials);
  return data.slug as string;
}

/** Updates an artist and rewrites its children. Returns the (possibly new) slug. */
export async function updateArtist(
  id: string,
  input: ArtistInput
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artists")
    .update({
      slug: input.slug,
      name: input.nameKo,
      english_name: input.nameEn,
      occupation: input.role,
      description: input.bio,
      photo: input.photo,
    })
    .eq("id", id)
    .select("slug")
    .single();
  if (error || !data) throw error ?? new Error("update failed");

  await replaceChildren(id, input.works, input.socials);
  return data.slug as string;
}

/**
 * Writes a new grid order: sort_order becomes each id's 1-based position in the
 * list. Drag-and-drop moves an artist to an arbitrary slot, so the whole order
 * is rewritten rather than a pair swapped.
 *
 * Sequential position values (1, 2, 3…) rather than the ids' old values, so the
 * result is a clean sequence no matter how the list was dragged.
 */
export async function setArtistOrder(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();

  const results = await Promise.all(
    orderedIds.map((id, i) =>
      supabase
        .from("artists")
        .update({ sort_order: i + 1 })
        .eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

/** Deletes an artist. Children go with it via `on delete cascade`. */
export async function deleteArtist(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("artists").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Finds a free slug, appending -2, -3, … on collision.
 *
 * `slug` is unique, so a duplicate would otherwise surface as a raw constraint
 * error the operator can do nothing with. `excludeId` keeps an artist from
 * colliding with itself when its own slug is unchanged.
 */
export async function uniqueSlug(
  base: string,
  excludeId?: string
): Promise<string> {
  const supabase = await createClient();

  let query = supabase.from("artists").select("slug");
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;

  const taken = new Set((data ?? []).map((r) => r.slug as string));
  if (!taken.has(base)) return base;

  for (let n = 2; ; n += 1) {
    const candidate = `${base}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}
