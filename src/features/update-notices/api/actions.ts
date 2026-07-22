"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  NOTICE_TAG,
  createNotice,
  updateNotice,
  deleteNotice,
  setNoticeActive,
  noticeSlugTaken,
  addNoticeCategory,
  deleteNoticeCategory,
  updateNoticeCategory,
  reassignNoticesCategory,
  noticeCategoryNameExists,
  getNoticeCategoryName,
  isNoticeCategoryInUse,
  type NoticeInput,
} from "@entities/notices";

export type NoticeFormState = { ok: boolean; error?: string };

const text = (v: FormDataEntryValue | null) => String(v ?? "").trim();

async function assertAuthed(): Promise<NoticeFormState | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };
  return null;
}

function revalidate() {
  updateTag(NOTICE_TAG);
  revalidatePath("/notice");
  revalidatePath("/admin/notices");
  revalidatePath("/");
}

/**
 * Creates or updates a notice. `id` empty means create. Redirects to the list
 * on success; only returns on error (shown inline).
 */
export async function saveNotice(
  _prev: NoticeFormState,
  formData: FormData
): Promise<NoticeFormState> {
  const unauthed = await assertAuthed();
  if (unauthed) return unauthed;

  const id = text(formData.get("id"));
  const title = text(formData.get("title"));
  const category = text(formData.get("category"));
  const date = text(formData.get("date"));
  const external = text(formData.get("linkType")) === "external";
  const externalUrl = text(formData.get("externalUrl")) || null;

  if (!title) return { ok: false, error: "제목을 입력해주세요." };
  if (!category) return { ok: false, error: "분류를 선택해주세요." };
  if (!date) return { ok: false, error: "게시일을 선택해주세요." };
  if (external && !externalUrl) {
    return { ok: false, error: "외부 링크 URL 을 입력해주세요." };
  }

  const slug = text(formData.get("slug")) || null;
  if (slug) {
    if (!/^[A-Za-z0-9_-]+$/.test(slug)) {
      return { ok: false, error: "URL 주소는 영문, 숫자, -, _ 만 사용할 수 있습니다." };
    }
    if (await noticeSlugTaken(slug, id || undefined)) {
      return { ok: false, error: "이미 사용 중인 주소입니다." };
    }
  }

  const input: NoticeInput = {
    slug,
    category,
    title,
    body: String(formData.get("body") ?? ""),
    linkType: external ? "external" : "article",
    externalUrl,
    isActive: text(formData.get("active")) === "true",
    publishedAt: `${date}T00:00:00Z`,
  };

  try {
    if (id) await updateNotice(id, input);
    else await createNotice(input);
  } catch {
    return { ok: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  revalidate();
  // The form toasts and navigates to the list itself.
  return { ok: true };
}

/** Deletes a notice. */
export async function removeNotice(id: string): Promise<NoticeFormState> {
  const unauthed = await assertAuthed();
  if (unauthed) return unauthed;
  try {
    await deleteNotice(id);
  } catch {
    return { ok: false, error: "삭제에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }
  revalidate();
  return { ok: true };
}

/** Flips a notice's publish switch from the list row. */
export async function toggleNoticeActive(id: string, active: boolean): Promise<NoticeFormState> {
  const unauthed = await assertAuthed();
  if (unauthed) return unauthed;
  try {
    await setNoticeActive(id, active);
  } catch {
    return { ok: false, error: "변경에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }
  revalidate();
  return { ok: true };
}

/** Adds a category to the managed list. */
export async function addCategory(name: string): Promise<NoticeFormState> {
  const unauthed = await assertAuthed();
  if (unauthed) return unauthed;
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "카테고리명을 입력해주세요." };
  try {
    await addNoticeCategory(trimmed);
  } catch {
    return { ok: false, error: "이미 있는 카테고리이거나 저장에 실패했습니다." };
  }
  revalidate();
  return { ok: true };
}

/** Renames a category, carrying the change through to notices that used it. */
export async function renameCategory(id: number, name: string): Promise<NoticeFormState> {
  const unauthed = await assertAuthed();
  if (unauthed) return unauthed;
  const next = name.trim();
  if (!next) return { ok: false, error: "카테고리명을 입력해주세요." };
  const current = await getNoticeCategoryName(id);
  if (!current) return { ok: false, error: "카테고리를 찾을 수 없습니다." };
  if (next === current) return { ok: true };
  if (await noticeCategoryNameExists(next, id)) {
    return { ok: false, error: "이미 있는 카테고리입니다." };
  }
  try {
    await updateNoticeCategory(id, next);
    await reassignNoticesCategory(current, next);
  } catch {
    return { ok: false, error: "수정에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }
  revalidate();
  return { ok: true };
}

/** Deletes a category, unless a notice still uses it. */
export async function removeCategory(id: number): Promise<NoticeFormState> {
  const unauthed = await assertAuthed();
  if (unauthed) return unauthed;
  const name = await getNoticeCategoryName(id);
  if (name && (await isNoticeCategoryInUse(name))) {
    return { ok: false, error: "사용 중인 카테고리는 삭제할 수 없습니다." };
  }
  try {
    await deleteNoticeCategory(id);
  } catch {
    return { ok: false, error: "삭제에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }
  revalidate();
  return { ok: true };
}
