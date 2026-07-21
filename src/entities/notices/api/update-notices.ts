import { createClient } from "@/lib/supabase/server";
import { NOTICE_SELECT, toNotice, type NoticeRowData } from "../model/normalize";
import type { Notice, NoticeLinkType } from "../model/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type NoticeInput = {
  slug: string | null;
  category: string;
  title: string;
  body: string;
  linkType: NoticeLinkType;
  externalUrl: string | null;
  isActive: boolean;
  /** ISO timestamp for published_at. */
  publishedAt: string;
};

function columns(input: NoticeInput) {
  return {
    slug: input.slug,
    category: input.category,
    title: input.title,
    content: input.body,
    type: input.linkType === "external" ? 1 : 0,
    reference_url: input.externalUrl,
    is_active: input.isActive,
    published_at: input.publishedAt,
  };
}

/** All notices for the admin list — authed, uncached (drafts included). */
export async function getNoticesAdmin(): Promise<Notice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notices")
    .select(NOTICE_SELECT)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as NoticeRowData[]).map(toNotice);
}

/** One notice for the edit form by route identifier (custom slug or id). */
export async function getNoticeByRefAdmin(ref: string): Promise<Notice | null> {
  const supabase = await createClient();

  const bySlug = await supabase
    .from("notices")
    .select(NOTICE_SELECT)
    .eq("slug", ref)
    .maybeSingle();
  if (bySlug.data) return toNotice(bySlug.data as unknown as NoticeRowData);

  if (UUID_RE.test(ref)) {
    const byId = await supabase
      .from("notices")
      .select(NOTICE_SELECT)
      .eq("id", ref)
      .maybeSingle();
    if (byId.data) return toNotice(byId.data as unknown as NoticeRowData);
  }
  return null;
}

/** Inserts a notice. Returns the new id. */
export async function createNotice(input: NoticeInput): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notices")
    .insert(columns(input))
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("insert failed");
  return data.id as string;
}

/** Updates a notice. */
export async function updateNotice(id: string, input: NoticeInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notices").update(columns(input)).eq("id", id);
  if (error) throw error;
}

/** Flips a notice's publish switch (the list-row toggle). */
export async function setNoticeActive(id: string, active: boolean): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notices").update({ is_active: active }).eq("id", id);
  if (error) throw error;
}

/** Deletes a notice. */
export async function deleteNotice(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) throw error;
}

/** Whether a custom slug is already used by another notice. */
export async function noticeSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("notices").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return (data ?? []).length > 0;
}
