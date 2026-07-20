"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia, removeMedia } from "@/lib/supabase/storage";
import {
  getPageContent,
  updatePageContent,
  PAGE_CONTENT_TAG,
} from "@entities/page-content";
import { MEDIA_FOLDER } from "@shared/config/storage";

export type HomeSlideFormState = { ok: boolean; error?: string };

/** Banner fields, matching the AdminImageUpload `name`s in the editor. */
const BANNERS = [
  { field: "bannerDesktop", key: "desktop" },
  { field: "bannerMobile", key: "mobile" },
] as const;

/**
 * An untouched file input still submits a File — empty, named "" — so `size` is
 * the only reliable signal that the operator actually picked something.
 */
function pickedFile(value: FormDataEntryValue | null): File | null {
  if (!(value instanceof File) || value.size === 0) return null;
  return value.type.startsWith("image/") ? value : null;
}

/**
 * Saves one home slide: the copy, the CTA label, and either banner image.
 *
 * Unlike the logo there is no width to carry — banners are pinned to an exact
 * size by `requiredSize`, so the stored value is just the storage path.
 */
export async function saveHomeSlide(
  _prev: HomeSlideFormState,
  formData: FormData,
): Promise<HomeSlideFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  const slug = String(formData.get("slug") ?? "");
  if (!slug) return { ok: false, error: "잘못된 요청입니다." };

  // Read back so metadata this form does not expose (order, scheme, section,
  // shows_news …) survives — the column is replaced wholesale on update.
  const current = await getPageContent(slug);
  if (!current) return { ok: false, error: "해당 화면을 찾을 수 없습니다." };

  const banner = {
    ...((current.metadata.banner as Record<string, unknown>) ?? {}),
  } as Record<string, string | null>;

  // Paths that become unreferenced once the write succeeds.
  const stale: string[] = [];
  // Paths uploaded during this call, to roll back if the write fails.
  const uploaded: string[] = [];

  for (const { field, key } of BANNERS) {
    const previous = typeof banner[key] === "string" ? banner[key] : null;

    if (formData.get(`${field}_cleared`) === "1") {
      banner[key] = null;
      if (previous) stale.push(previous);
      continue;
    }

    const file = pickedFile(formData.get(field));
    if (!file) continue; // untouched — keep what is stored

    try {
      const path = await uploadMedia(MEDIA_FOLDER.home, file);
      banner[key] = path;
      uploaded.push(path);
      if (previous) stale.push(previous);
    } catch {
      // Nothing has been written yet, so the operator can simply retry. Drop
      // anything already uploaded in this pass rather than orphan it.
      await Promise.all(uploaded.map((p) => removeMedia(p).catch(() => {})));
      return {
        ok: false,
        error: "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.",
      };
    }
  }

  const cta = { ...((current.metadata.cta as Record<string, unknown>) ?? {}) };
  cta.label = String(formData.get("ctaLabel") ?? "");

  try {
    await updatePageContent(slug, {
      subtitle: String(formData.get("eyebrow") ?? ""),
      title: String(formData.get("title") ?? ""),
      // Empty stays empty rather than becoming "", so the news slide keeps
      // rendering its headline list instead of a blank paragraph.
      description: String(formData.get("body") ?? "") || null,
      metadata: { ...current.metadata, banner, cta },
    });
  } catch {
    await Promise.all(uploaded.map((p) => removeMedia(p).catch(() => {})));
    return { ok: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  // Only now are the old files unreferenced. Best-effort: an orphaned file is a
  // janitorial problem, but a save that reports failure after succeeding is not.
  await Promise.all(
    stale
      .filter((p) => p !== banner.desktop && p !== banner.mobile)
      .map((p) => removeMedia(p).catch(() => {})),
  );

  // revalidatePath does not reach the `"use cache"` entry behind getHomeSlides.
  updateTag(PAGE_CONTENT_TAG);
  revalidatePath("/admin/home");
  revalidatePath("/");

  return { ok: true };
}
