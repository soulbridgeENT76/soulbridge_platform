"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia, removeMedia } from "@/lib/supabase/storage";
import { updateBrand, getBrand, BRAND_TAG, type BrandLogo } from "@entities/brand";
import { MEDIA_FOLDER } from "@shared/config/storage";
import { LOGO_OUTPUT_HEIGHT } from "@shared/config/media";

export type BrandFormState = { ok: boolean; error?: string };

/** Sanity bound on the client-reported width — a logo is never this wide. */
const MAX_LOGO_WIDTH = 8192;

/**
 * An untouched file input still submits a File — empty, named "" — so `size` is
 * the only reliable signal that the operator actually picked something. This is
 * what makes "leave the stored logo alone" expressible at all.
 */
function pickedFile(value: FormDataEntryValue | null): File | null {
  if (!(value instanceof File) || value.size === 0) return null;
  return value.type.startsWith("image/") ? value : null;
}

/** The encoded width, measured in the browser (see AdminImageUpload). */
function parseWidth(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 && n <= MAX_LOGO_WIDTH ? n : null;
}

export async function saveBrand(
  _prev: BrandFormState,
  formData: FormData,
): Promise<BrandFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { ok: false, error: "로그인이 필요합니다." };

  // Read back so fields the form does not expose (description, copyright)
  // survive — updateBrand overwrites the whole jsonb column.
  const current = await getBrand();

  // Default to keeping what is stored. The previous version coerced the File to
  // a string here, which overwrote the logo with "[object File]" on every save.
  let logo: BrandLogo | null = current.brand.logo;
  let stale: string | null = null;

  if (formData.get("logo_cleared") === "1") {
    logo = null;
    stale = current.brand.logo?.path ?? null;
  } else {
    const file = pickedFile(formData.get("logo"));
    if (file) {
      const width = parseWidth(formData.get("logo_width"));
      // A logo with no width would break the hero mask's aspect ratio, so
      // refuse rather than store something half-formed.
      if (!width) {
        return { ok: false, error: "이미지 크기를 읽지 못했습니다. 다시 선택해주세요." };
      }

      try {
        // Upload before touching the database: a failure here leaves nothing
        // half-applied, so the operator can simply retry.
        const path = await uploadMedia(MEDIA_FOLDER.logo, file);
        // Height comes from the constant, not the client — the uploader encodes
        // to exactly this and it is not the browser's call to say otherwise.
        logo = { path, width, height: LOGO_OUTPUT_HEIGHT };
        stale = current.brand.logo?.path ?? null;
      } catch {
        return {
          ok: false,
          error: "로고 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.",
        };
      }
    }
  }

  try {
    await updateBrand({
      brand: {
        ...current.brand,
        name: String(formData.get("name") ?? ""),
        intro: String(formData.get("intro") ?? ""),
        logo,
      },
      socials: {
        ...current.socials,
        instagram: String(formData.get("instagram") ?? ""),
        youtube: String(formData.get("youtube") ?? ""),
        messenger: String(formData.get("messenger") ?? ""),
      },
    });
  } catch {
    // The row still points at the old logo, so the file we just uploaded is
    // unreachable. Best-effort cleanup; an orphan is not worth failing twice.
    if (logo && logo.path !== current.brand.logo?.path) {
      await removeMedia(logo.path).catch(() => {});
    }
    return { ok: false, error: "저장에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  // Only now is the old file unreferenced. Deleting before the write would leave
  // the row pointing at a 404 if the write failed, and a delete that throws must
  // not turn a successful save into a reported failure.
  if (stale && stale !== logo?.path) {
    await removeMedia(stale).catch(() => {});
  }

  // revalidatePath only invalidates route caches; the `"use cache"` entry behind
  // getSiteLogo() is keyed independently and would otherwise serve the old logo
  // indefinitely. updateTag (rather than revalidateTag) also refreshes the
  // current render, so the admin sees the new logo without a second reload.
  updateTag(BRAND_TAG);

  revalidatePath("/admin/brand");
  revalidatePath("/admin/contact");
  revalidatePath("/admin/footer");
  // The header and footer render on every public page.
  revalidatePath("/", "layout");

  return { ok: true };
}
