import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { NOTICE_SELECT, toNotice, type NoticeRowData } from "../model/normalize";
import type { Notice } from "../model/types";

/** Invalidated by the notice save/delete actions via updateTag(). */
export const NOTICE_TAG = "notices";

/**
 * Published notices, newest first. The anon client + RLS filter to only active
 * rows whose published_at has passed, so drafts and scheduled items never leak.
 */
export async function getPublishedNotices(): Promise<Notice[]> {
  "use cache";
  cacheTag(NOTICE_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("notices")
      .select(NOTICE_SELECT)
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return (data as unknown as NoticeRowData[]).map(toNotice);
  } catch {
    return [];
  }
}

/** One published notice by its route identifier (custom slug or id), or null. */
export async function getNoticeByRef(ref: string): Promise<Notice | null> {
  const items = await getPublishedNotices();
  return items.find((n) => n.slug === ref || n.id === ref) ?? null;
}
