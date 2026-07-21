import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/server";
import { NOTICE_CATEGORIES } from "../model/types";
import { NOTICE_TAG } from "./get-notices";

export type NoticeCategoryRow = { id: number; name: string };

/**
 * Category names for the public filter tabs, in display order. Cached under
 * NOTICE_TAG so category and notice edits share one invalidation. Falls back to
 * the bundled list when empty or unreachable.
 */
export async function getNoticeCategories(): Promise<string[]> {
  "use cache";
  cacheTag(NOTICE_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("notice_categories")
      .select("name")
      .order("id", { ascending: true });
    if (error || !data || data.length === 0) return [...NOTICE_CATEGORIES];
    return data.map((r) => r.name as string);
  } catch {
    return [...NOTICE_CATEGORIES];
  }
}

/** Categories with ids for the admin manager — authed, uncached. */
export async function getNoticeCategoriesAdmin(): Promise<NoticeCategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notice_categories")
    .select("id, name")
    .order("id", { ascending: true });
  if (error || !data) return [];
  return data as NoticeCategoryRow[];
}

export async function addNoticeCategory(name: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notice_categories").insert({ name });
  if (error) throw error;
}

export async function deleteNoticeCategory(id: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notice_categories").delete().eq("id", id);
  if (error) throw error;
}

/** Renames a category. */
export async function updateNoticeCategory(id: number, name: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notice_categories").update({ name }).eq("id", id);
  if (error) throw error;
}

/** Repoints every notice on the old category name to the new one. */
export async function reassignNoticesCategory(oldName: string, newName: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notices").update({ category: newName }).eq("category", oldName);
  if (error) throw error;
}

/** Whether a category name is already used by another category. */
export async function noticeCategoryNameExists(name: string, excludeId?: number): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("notice_categories").select("id").eq("name", name);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return (data ?? []).length > 0;
}

/** The name of a category by id — for the in-use check before deleting/renaming. */
export async function getNoticeCategoryName(id: number): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("notice_categories").select("name").eq("id", id).single();
  return (data?.name as string | undefined) ?? null;
}

/** Whether any notice still uses this category name (blocks deletion). */
export async function isNoticeCategoryInUse(name: string): Promise<boolean> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("notices")
    .select("id", { count: "exact", head: true })
    .eq("category", name);
  return (count ?? 0) > 0;
}
