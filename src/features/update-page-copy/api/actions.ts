"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getPageContent,
  updatePageContent,
  PAGE_CONTENT_TAG,
} from "@entities/page-content";

export type PageCopyFormState = { ok: boolean; error?: string };

/**
 * Saves the heading block of one section page. Shared by every page whose admin
 * screen edits just eyebrow/title/description ("about", "contents", "artists",
 * "notice", "contact") — the row is addressed by the hidden `slug` field.
 *
 * `metadata` is written back untouched: nav order, hrefs and anything else the
 * form does not expose must survive, and the column is replaced wholesale.
 */
export async function savePageCopy(
  _prev: PageCopyFormState,
  formData: FormData,
): Promise<PageCopyFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  const slug = String(formData.get("slug") ?? "");
  if (!slug) return { ok: false, error: "잘못된 요청입니다." };

  const current = await getPageContent(slug);
  if (!current) return { ok: false, error: "해당 페이지를 찾을 수 없습니다." };

  // The eyebrow is not on every screen — the home slide's CTA label doubles as
  // it on some pages. Keep the stored one when the form omits the field.
  const eyebrow = formData.get("eyebrow");

  try {
    await updatePageContent(slug, {
      subtitle: eyebrow === null ? current.subtitle : String(eyebrow),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      metadata: current.metadata,
    });
  } catch {
    return { ok: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  // revalidatePath does not reach the `"use cache"` entry behind getPageCopy.
  updateTag(PAGE_CONTENT_TAG);
  revalidatePath("/", "layout");

  return { ok: true };
}
