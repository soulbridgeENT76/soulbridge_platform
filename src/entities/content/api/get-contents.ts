import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { CONTENT_SELECT, toContent, type ContentRow } from "../model/normalize";
import type { Content } from "../model/types";

/** Invalidated by the content save/delete actions via updateTag(). */
export const CONTENT_TAG = "contents";

/**
 * The public content lineup, newest first. Cached under one tag and cookie-free
 * for the same reasons as the other public readers — reading cookies inside
 * `"use cache"` throws and would strip prerendering from the contents pages.
 */
export async function getContents(): Promise<Content[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("contents")
      .select(CONTENT_SELECT)
      .order("created_at", { ascending: false });

    // Degrade to an empty lineup rather than 500-ing the page — and rather than
    // failing `next build`, which prerenders these routes with no database.
    if (error || !data) return [];
    return (data as unknown as ContentRow[]).map(toContent);
  } catch {
    return [];
  }
}

/**
 * One content by its route identifier — a custom slug or the id. Resolved
 * in-memory against the cached lineup, so a non-uuid slug never hits a uuid
 * column cast. Shares the lineup's single cache entry.
 */
export async function getContentByRef(ref: string): Promise<Content | null> {
  const contents = await getContents();
  return contents.find((c) => c.slug === ref || c.id === ref) ?? null;
}
