import { createClient } from "@/lib/supabase/server";
import { CONTENT_SELECT, toContent, type ContentRow } from "../model/normalize";
import type { Content } from "../model/types";

/**
 * Server-only. Not a server action: "use server" would expose these as public
 * endpoints past any auth check. The feature-layer action owns that check and
 * calls these — the same split as entities/artist.
 */

/** Matches a uuid, so a lookup can tell a custom slug from an id. */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The editable columns. thumbnailUrl is a Storage path (image) or a video id. */
export type ContentInput = {
  /** Custom slug, or null to route by id. */
  slug: string | null;
  category: string;
  title: string;
  year: string;
  note: string;
  synopsis: string;
  /** 0 = image, 1 = youtube. */
  thumbnailType: 0 | 1;
  thumbnailUrl: string | null;
};

function columns(input: ContentInput) {
  return {
    slug: input.slug,
    category: input.category,
    title: input.title,
    year: input.year,
    description: input.note,
    content: input.synopsis,
    thumbnail_type: input.thumbnailType,
    thumbnail_url: input.thumbnailUrl,
  };
}

/** Full lineup for the admin list — authed, uncached. */
export async function getContentsAdmin(): Promise<Content[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contents")
    .select(CONTENT_SELECT)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as ContentRow[]).map(toContent);
}

/**
 * One content for the edit form by its route identifier (custom slug or id) —
 * authed, uncached, so it is never stale. Tries the slug first; only a uuid-
 * shaped ref is looked up by id (an id.eq on a non-uuid would raise a cast
 * error).
 */
export async function getContentByRefAdmin(
  ref: string
): Promise<Content | null> {
  const supabase = await createClient();

  const bySlug = await supabase
    .from("contents")
    .select(CONTENT_SELECT)
    .eq("slug", ref)
    .maybeSingle();
  if (bySlug.data) return toContent(bySlug.data as unknown as ContentRow);

  if (UUID_RE.test(ref)) {
    const byId = await supabase
      .from("contents")
      .select(CONTENT_SELECT)
      .eq("id", ref)
      .maybeSingle();
    if (byId.data) return toContent(byId.data as unknown as ContentRow);
  }
  return null;
}

/**
 * The stored thumbnail of a content, so a caller can clean up a replaced image.
 * Only image rows (type 0) hold a Storage file worth removing.
 */
export async function getContentThumbnail(
  id: string
): Promise<{ url: string | null; type: number }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contents")
    .select("thumbnail_url, thumbnail_type")
    .eq("id", id)
    .single();
  return {
    url: (data?.thumbnail_url as string | null) ?? null,
    type: (data?.thumbnail_type as number | undefined) ?? 0,
  };
}

/** Inserts a content. Returns the new slug. */
export async function createContent(input: ContentInput): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contents")
    .insert(columns(input))
    .select("slug")
    .single();
  if (error || !data) throw error ?? new Error("insert failed");
  return data.slug as string;
}

/** Updates a content. Returns the (possibly new) slug. */
export async function updateContent(
  id: string,
  input: ContentInput
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contents")
    .update(columns(input))
    .eq("id", id)
    .select("slug")
    .single();
  if (error || !data) throw error ?? new Error("update failed");
  return data.slug as string;
}

/** Deletes a content. */
export async function deleteContent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("contents").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Whether a custom slug is already used by another content. A custom slug is
 * intentional, so a collision is an error the operator should see — not
 * something to silently dedupe. `excludeId` lets a content keep its own slug.
 */
export async function slugTaken(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("contents").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return (data ?? []).length > 0;
}
