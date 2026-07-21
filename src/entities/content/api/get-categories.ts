import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/server";
import { CONTENT_CATEGORIES } from "../model/types";
import { CONTENT_TAG } from "./get-contents";

export type ContentCategoryRow = { id: number; name: string };

/**
 * Category names for the public filter tabs, in display order. Cached under
 * CONTENT_TAG so category and content edits share one invalidation. Falls back
 * to the bundled list when empty or unreachable, so the filter never renders
 * with no tabs.
 */
export async function getContentCategories(): Promise<string[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("content_categories")
      .select("name")
      .order("id", { ascending: true });
    if (error || !data || data.length === 0) return [...CONTENT_CATEGORIES];
    return data.map((r) => r.name as string);
  } catch {
    return [...CONTENT_CATEGORIES];
  }
}

/** Categories with ids for the admin manager — authed, uncached. */
export async function getContentCategoriesAdmin(): Promise<ContentCategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_categories")
    .select("id, name")
    .order("id", { ascending: true });
  if (error || !data) return [];
  return data as ContentCategoryRow[];
}

/**
 * Server-only writes. Not server actions: "use server" would expose these past
 * any auth check. The feature-layer actions own that check and call these.
 */

export async function addContentCategory(name: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("content_categories").insert({ name });
  if (error) throw error;
}

export async function deleteContentCategory(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("content_categories")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

/** Renames a category. */
export async function updateContentCategory(
  id: number,
  name: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("content_categories")
    .update({ name })
    .eq("id", id);
  if (error) throw error;
}

/**
 * Repoints every content on the old category name to the new one. The category
 * is denormalised as text on contents, so a rename has to carry through or
 * those rows fall out of the (renamed) filter.
 */
export async function reassignContentsCategory(
  oldName: string,
  newName: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contents")
    .update({ category: newName })
    .eq("category", oldName);
  if (error) throw error;
}

/** Whether a category name is already used by another category. */
export async function categoryNameExists(
  name: string,
  excludeId?: number
): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("content_categories").select("id").eq("name", name);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return (data ?? []).length > 0;
}

/** The name of a category by id — for the in-use check before deleting. */
export async function getContentCategoryName(
  id: number
): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_categories")
    .select("name")
    .eq("id", id)
    .single();
  return (data?.name as string | undefined) ?? null;
}

/** Whether any content still uses this category name (blocks its deletion). */
export async function isContentCategoryInUse(name: string): Promise<boolean> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("contents")
    .select("id", { count: "exact", head: true })
    .eq("category", name);
  return (count ?? 0) > 0;
}
