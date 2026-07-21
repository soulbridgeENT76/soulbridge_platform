"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  getPageContent,
  updatePageContent,
  PAGE_CONTENT_TAG,
} from "@entities/page-content";

export type ContactFormState = { ok: boolean; error?: string };

const SLUG = "contact";

/**
 * Saves the CONTACT page: heading copy into the row's columns, contact details
 * into its metadata (same split as saveAbout). The eyebrow is not edited on
 * this screen, so its column is preserved; the metadata is merged so nav order
 * and href survive.
 */
export async function saveContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  const current = await getPageContent(SLUG);
  if (!current) return { ok: false, error: "CONTACT 페이지를 찾을 수 없습니다." };

  const value = (name: string) => String(formData.get(name) ?? "").trim();

  // Mirrors the form's rules — a server action is a public endpoint. Both are
  // optional, so a blank one is fine; a filled one must match.
  const tel = value("tel");
  if (tel && !/^\d+(-\d+)*$/.test(tel)) {
    return { ok: false, error: "회사번호는 숫자와 - 만 사용할 수 있습니다." };
  }
  const email = value("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "올바른 이메일 형식이 아닙니다." };
  }

  try {
    await updatePageContent(SLUG, {
      subtitle: current.subtitle, // eyebrow — not exposed on this screen
      title: value("title"),
      description: value("description") || null,
      metadata: {
        ...current.metadata,
        address: value("address"),
        tel: value("tel"),
        email: value("email"),
        mapAddress: value("mapAddress"),
      },
    });
  } catch {
    return { ok: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  updateTag(PAGE_CONTENT_TAG);
  revalidatePath("/contact");

  return { ok: true };
}
