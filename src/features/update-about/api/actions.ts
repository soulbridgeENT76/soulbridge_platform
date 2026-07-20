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

export type AboutFormState = { ok: boolean; error?: string };

const SLUG = "about";

/**
 * An untouched file input still submits a File — empty, named "" — so `size` is
 * the only reliable signal that the operator actually picked something.
 */
function pickedFile(value: FormDataEntryValue | null): File | null {
  if (!(value instanceof File) || value.size === 0) return null;
  return value.type.startsWith("image/") ? value : null;
}

/** Trim, drop blanks — an empty bullet or section renders as a gap. */
function cleanStrings(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim())
    .filter(Boolean);
}

type Section = {
  label: string;
  title: string;
  items: { title: string; description: string }[];
};

/**
 * The sections are a variable-length tree, so the editor serializes them to one
 * JSON field rather than inventing indexed form names. Re-validated here: a
 * server action is a public endpoint, and the shape lands straight in jsonb.
 */
function parseSections(raw: FormDataEntryValue | null): Section[] | null {
  if (typeof raw !== "string") return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed.map((s) => {
      const sec = (s ?? {}) as Record<string, unknown>;
      const items = Array.isArray(sec.items) ? sec.items : [];
      return {
        label: String(sec.label ?? "").trim(),
        title: String(sec.title ?? "").trim(),
        items: items
          .map((i) => {
            const item = (i ?? {}) as Record<string, unknown>;
            return {
              title: String(item.title ?? "").trim(),
              description: String(item.description ?? "").trim(),
            };
          })
          .filter((i) => i.title || i.description),
      };
    });
  } catch {
    return null;
  }
}

/** Saves the ABOUT leadership block and its variable sections. */
export async function saveAbout(
  _prev: AboutFormState,
  formData: FormData,
): Promise<AboutFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  const current = await getPageContent(SLUG);
  if (!current) return { ok: false, error: "ABOUT 페이지를 찾을 수 없습니다." };

  const sections = parseSections(formData.get("sections"));
  if (!sections) return { ok: false, error: "섹션 정보를 읽지 못했습니다." };

  const storedLeadership =
    (current.metadata.leadership as Record<string, unknown>) ?? {};
  const previousPhoto =
    typeof storedLeadership.photo === "string" ? storedLeadership.photo : null;

  let photo = previousPhoto;
  let stale: string | null = null;
  let uploaded: string | null = null;

  if (formData.get("leaderPhoto_cleared") === "1") {
    photo = null;
    stale = previousPhoto;
  } else {
    const file = pickedFile(formData.get("leaderPhoto"));
    if (file) {
      try {
        // Upload before touching the database so a failure leaves nothing
        // half-applied and the operator can simply retry.
        uploaded = await uploadMedia(MEDIA_FOLDER.about, file);
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

  const leadership = {
    label: String(formData.get("leaderLabel") ?? "").trim(),
    role: String(formData.get("leaderRole") ?? "").trim(),
    name: String(formData.get("leaderName") ?? "").trim(),
    bio: String(formData.get("leaderBio") ?? ""),
    points: cleanStrings(formData.getAll("leaderPoint")),
    photo,
  };

  try {
    await updatePageContent(SLUG, {
      // The heading has its own form; leave those columns as they are.
      subtitle: current.subtitle,
      title: current.title,
      description: current.description,
      metadata: { ...current.metadata, leadership, sections },
    });
  } catch {
    if (uploaded) await removeMedia(uploaded).catch(() => {});
    return { ok: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  // Only now is the old file unreferenced. Best-effort: an orphan is a
  // janitorial problem, a save that reports failure after succeeding is not.
  if (stale && stale !== photo) await removeMedia(stale).catch(() => {});

  updateTag(PAGE_CONTENT_TAG);
  revalidatePath("/about");
  revalidatePath("/admin/about");

  return { ok: true };
}
