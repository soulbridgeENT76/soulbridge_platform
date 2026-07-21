"use server";

import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia, removeMedia } from "@/lib/supabase/storage";
import {
  CONTENT_TAG,
  createContent,
  updateContent,
  deleteContent,
  getContentThumbnail,
  slugTaken,
  addContentCategory,
  deleteContentCategory,
  updateContentCategory,
  reassignContentsCategory,
  categoryNameExists,
  getContentCategoryName,
  isContentCategoryInUse,
  type ContentInput,
} from "@entities/content";
import { parseYoutubeId } from "@shared/lib/youtube";
import { MEDIA_FOLDER } from "@shared/config/storage";

export type ContentFormState = { ok: boolean; error?: string };

function pickedFile(value: FormDataEntryValue | null): File | null {
  if (!(value instanceof File) || value.size === 0) return null;
  return value.type.startsWith("image/") ? value : null;
}

const text = (v: FormDataEntryValue | null) => String(v ?? "").trim();

/**
 * Creates or updates a content. `id` empty means create. Redirects to the list
 * on success (the confirmation), so it only returns on error — shown inline.
 */
export async function saveContent(
  _prev: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  const id = text(formData.get("id"));
  const title = text(formData.get("title"));
  const category = text(formData.get("category"));
  if (!category) return { ok: false, error: "카테고리를 선택해주세요." };
  if (!title) return { ok: false, error: "제목을 입력해주세요." };

  // Slug is optional. When left blank the content is reached by its id; a
  // provided value must be URL-safe and unique — a custom address is
  // intentional, so both a bad charset and a clash are errors (mirrors the
  // form's rule; a server action is a public endpoint).
  const slug = text(formData.get("slug")) || null;
  if (slug) {
    if (!/^[A-Za-z0-9_-]+$/.test(slug)) {
      return {
        ok: false,
        error: "URL 주소는 영문, 숫자, -, _ 만 사용할 수 있습니다.",
      };
    }
    if (await slugTaken(slug, id || undefined)) {
      return {
        ok: false,
        error: "이미 사용 중인 주소입니다. 다른 주소를 입력해주세요.",
      };
    }
  }

  // Whichever media the row previously held — needed to clean up an image that
  // a save replaces or that a switch to YouTube leaves orphaned.
  const previous = id
    ? await getContentThumbnail(id)
    : { url: null as string | null, type: 0 };
  const previousImage = previous.type === 0 ? previous.url : null;

  const youtube = text(formData.get("mediaType")) === "video";
  let thumbnailType: 0 | 1 = youtube ? 1 : 0;
  let thumbnailUrl: string | null = null;
  let uploaded: string | null = null;
  let stale: string | null = null;

  if (youtube) {
    // A provided link must be a YouTube URL we can pull an id from; empty is
    // allowed (a video may not be set yet). Mirrors the form's rule.
    const raw = text(formData.get("youtubeUrl"));
    if (raw) {
      const vid = parseYoutubeId(raw);
      if (!vid) return { ok: false, error: "유튜브 URL 만 입력할 수 있습니다." };
      thumbnailUrl = vid;
    }
    // Leaving image mode orphans the old file.
    stale = previousImage;
  } else {
    thumbnailType = 0;
    if (formData.get("image_cleared") === "1") {
      thumbnailUrl = null;
      stale = previousImage;
    } else {
      const file = pickedFile(formData.get("image"));
      if (file) {
        try {
          uploaded = await uploadMedia(MEDIA_FOLDER.content, file);
          thumbnailUrl = uploaded;
          stale = previousImage;
        } catch {
          return {
            ok: false,
            error: "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.",
          };
        }
      } else {
        // No new file picked — keep the previously stored image.
        thumbnailUrl = previousImage;
      }
    }
  }

  const input: ContentInput = {
    slug,
    category,
    title,
    year: text(formData.get("airDate")),
    note: text(formData.get("subtitle")),
    synopsis: String(formData.get("body") ?? ""),
    thumbnailType,
    thumbnailUrl,
  };

  try {
    if (id) await updateContent(id, input);
    else await createContent(input);
  } catch {
    if (uploaded) await removeMedia(uploaded).catch(() => {});
    return { ok: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  if (stale && stale !== thumbnailUrl) await removeMedia(stale).catch(() => {});

  updateTag(CONTENT_TAG);
  revalidatePath("/contents");
  revalidatePath("/admin/contents");

  redirect("/admin/contents?saved=1");
}

/** Deletes a content and its uploaded image (if any). */
export async function removeContent(id: string): Promise<ContentFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  const thumb = await getContentThumbnail(id);

  try {
    await deleteContent(id);
  } catch {
    return { ok: false, error: "삭제에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  if (thumb.type === 0 && thumb.url) await removeMedia(thumb.url).catch(() => {});

  updateTag(CONTENT_TAG);
  revalidatePath("/contents");
  revalidatePath("/admin/contents");

  return { ok: true };
}

async function assertAuthed(): Promise<ContentFormState | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };
  return null;
}

/** Adds a category to the managed list (used by filter tabs and the form). */
export async function addCategory(name: string): Promise<ContentFormState> {
  const unauthed = await assertAuthed();
  if (unauthed) return unauthed;

  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "카테고리명을 입력해주세요." };

  try {
    await addContentCategory(trimmed);
  } catch {
    // The name is unique — a duplicate lands here too.
    return { ok: false, error: "이미 있는 카테고리이거나 저장에 실패했습니다." };
  }

  updateTag(CONTENT_TAG);
  revalidatePath("/contents");
  revalidatePath("/admin/contents");
  return { ok: true };
}

/**
 * Renames a category, carrying the change through to every content that used
 * the old name (the category is denormalised as text on contents).
 */
export async function renameCategory(
  id: number,
  name: string
): Promise<ContentFormState> {
  const unauthed = await assertAuthed();
  if (unauthed) return unauthed;

  const next = name.trim();
  if (!next) return { ok: false, error: "카테고리명을 입력해주세요." };

  const current = await getContentCategoryName(id);
  if (!current) return { ok: false, error: "카테고리를 찾을 수 없습니다." };
  if (next === current) return { ok: true };

  if (await categoryNameExists(next, id)) {
    return { ok: false, error: "이미 있는 카테고리입니다." };
  }

  try {
    // Rename the category, then repoint its contents. Order matters: the unique
    // check above makes the first write safe, and the second cannot clash.
    await updateContentCategory(id, next);
    await reassignContentsCategory(current, next);
  } catch {
    return { ok: false, error: "수정에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  updateTag(CONTENT_TAG);
  revalidatePath("/contents");
  revalidatePath("/admin/contents");
  return { ok: true };
}

/** Deletes a category, unless a content still uses it. */
export async function removeCategory(id: number): Promise<ContentFormState> {
  const unauthed = await assertAuthed();
  if (unauthed) return unauthed;

  const name = await getContentCategoryName(id);
  if (name && (await isContentCategoryInUse(name))) {
    return {
      ok: false,
      error: "사용 중인 카테고리는 삭제할 수 없습니다.",
    };
  }

  try {
    await deleteContentCategory(id);
  } catch {
    return { ok: false, error: "삭제에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  updateTag(CONTENT_TAG);
  revalidatePath("/contents");
  revalidatePath("/admin/contents");
  return { ok: true };
}
