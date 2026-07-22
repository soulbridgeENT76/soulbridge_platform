"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia, removeMedia } from "@/lib/supabase/storage";
import {
  ARTIST_TAG,
  createArtist,
  updateArtist,
  setArtistOrder,
  deleteArtist,
  getArtistPhotoPath,
  uniqueSlug,
  type ArtistInput,
} from "@entities/artist";
import { SOCIAL_KEYS, type SocialKey } from "@shared/config/socials";
import { MEDIA_FOLDER } from "@shared/config/storage";
import { slugify } from "@shared/lib/slugify";

export type ArtistFormState = { ok: boolean; error?: string };

/**
 * An untouched file input still submits a File — empty, named "" — so `size` is
 * the only reliable signal that the operator actually picked something.
 */
function pickedFile(value: FormDataEntryValue | null): File | null {
  if (!(value instanceof File) || value.size === 0) return null;
  return value.type.startsWith("image/") ? value : null;
}

const text = (v: FormDataEntryValue | null) => String(v ?? "").trim();

/**
 * The career rows are a variable-length list, so the form serializes them to
 * one JSON field rather than inventing indexed names. Re-validated here: a
 * server action is a public endpoint, and this lands straight in the database.
 */
function parseWorks(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((w) => {
        const row = (w ?? {}) as Record<string, unknown>;
        return {
          label: String(row.label ?? "").trim(),
          description: String(row.description ?? "").trim(),
        };
      })
      // A row with neither field renders as a gap in the career list.
      .filter((w) => w.label || w.description);
  } catch {
    return [];
  }
}

/** One fixed input per network; a blank one means "no link", not an empty link. */
function readSocials(formData: FormData) {
  return SOCIAL_KEYS.flatMap((key: SocialKey) => {
    const href = text(formData.get(key));
    return href ? [{ key, href }] : [];
  });
}

/**
 * Creates or updates an artist. `id` empty means create. On success returns
 * `{ ok: true }`; the form toasts and navigates to the list. Errors are shown
 * inline so the operator keeps their edits.
 */
export async function saveArtist(
  _prev: ArtistFormState,
  formData: FormData
): Promise<ArtistFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  const id = text(formData.get("id"));
  const nameKo = text(formData.get("nameKo"));
  const nameEn = text(formData.get("nameEn"));
  if (!nameKo) return { ok: false, error: "이름(한글)을 입력해주세요." };
  if (!nameEn) return { ok: false, error: "이름(영문)을 입력해주세요." };
  // Mirrors the form's rule — a server action is a public endpoint, so the
  // charset rule cannot live only in the browser.
  if (!/^[A-Za-z _-]+$/.test(nameEn)) {
    return {
      ok: false,
      error: "이름(영문)은 영문, 공백, -, _ 만 사용할 수 있습니다.",
    };
  }

  // The slug follows the English name — slugify lowercases it and drops the
  // underscore the display name may carry.
  const base = slugify(nameEn);
  if (!base) return { ok: false, error: "영문 이름에서 URL 을 만들지 못했습니다." };

  const previousPhoto = id ? await getArtistPhotoPath(id) : null;
  let photo = previousPhoto;
  let stale: string | null = null;
  let uploaded: string | null = null;

  if (formData.get("profile_cleared") === "1") {
    photo = null;
    stale = previousPhoto;
  } else {
    const file = pickedFile(formData.get("profile"));
    if (file) {
      try {
        // Upload before touching the database so a failure leaves nothing
        // half-applied and the operator can simply retry.
        uploaded = await uploadMedia(MEDIA_FOLDER.artist, file);
        photo = uploaded;
        stale = previousPhoto;
      } catch {
        return {
          ok: false,
          error: "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.",
        };
      }
    }
  }

  const input: ArtistInput = {
    slug: await uniqueSlug(base, id || undefined),
    nameKo,
    nameEn,
    role: text(formData.get("role")),
    bio: String(formData.get("bio") ?? ""),
    photo,
    works: parseWorks(formData.get("works")),
    socials: readSocials(formData),
  };

  try {
    if (id) await updateArtist(id, input);
    else await createArtist(input);
  } catch {
    // The row still points at the old photo, so the file we just uploaded is
    // unreachable. Best-effort cleanup; an orphan is not worth failing twice.
    if (uploaded) await removeMedia(uploaded).catch(() => {});
    return { ok: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  // Only now is the old file unreferenced. Best-effort: an orphan is a
  // janitorial problem, a save that reports failure after succeeding is not.
  if (stale && stale !== photo) await removeMedia(stale).catch(() => {});

  updateTag(ARTIST_TAG);
  revalidatePath("/artists");
  revalidatePath("/admin/artists");

  // The form toasts and navigates to the list itself, like the stay-put editors.
  return { ok: true };
}

/**
 * Deletes an artist and its photo. Careers and links go with the row via
 * `on delete cascade`, so there is nothing else to clean up.
 */
export async function removeArtist(id: string): Promise<ArtistFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  const photo = await getArtistPhotoPath(id);

  try {
    await deleteArtist(id);
  } catch {
    return { ok: false, error: "삭제에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  if (photo) await removeMedia(photo).catch(() => {});

  updateTag(ARTIST_TAG);
  revalidatePath("/artists");
  revalidatePath("/admin/artists");

  return { ok: true };
}

/** Persists a drag-and-drop reorder: the ids in their new top-to-bottom order. */
export async function reorderArtists(
  orderedIds: string[]
): Promise<ArtistFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  // A server action is a public endpoint — reject anything that is not a list
  // of id strings rather than writing malformed positions.
  if (
    !Array.isArray(orderedIds) ||
    orderedIds.some((id) => typeof id !== "string")
  ) {
    return { ok: false, error: "순서 정보가 올바르지 않습니다." };
  }

  try {
    await setArtistOrder(orderedIds);
  } catch {
    return { ok: false, error: "순서 변경에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  updateTag(ARTIST_TAG);
  revalidatePath("/artists");
  revalidatePath("/admin/artists");

  return { ok: true };
}
