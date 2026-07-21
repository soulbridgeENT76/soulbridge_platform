"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  PAGE_CONTENT_TAG,
  setSectionActive,
} from "@entities/page-content";

export type VisibilityState = { ok: boolean; error?: string };

/**
 * Flips a section's "메뉴 노출" (page_contents.is_active). Turning it off drops
 * the section from the header/menu and its home banner slide; the page route
 * itself stays reachable by direct URL.
 */
export async function setSectionVisibility(
  slug: string,
  active: boolean
): Promise<VisibilityState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  try {
    await setSectionActive(slug, active);
  } catch {
    return { ok: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  // The header nav and home slides both read visibility under this tag, so one
  // invalidation refreshes every cached page that shows the menu.
  updateTag(PAGE_CONTENT_TAG);
  revalidatePath("/");
  revalidatePath(`/${slug}`);

  return { ok: true };
}
