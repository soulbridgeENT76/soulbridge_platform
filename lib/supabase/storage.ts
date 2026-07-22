import { createClient } from "./server";
import { MEDIA_BUCKET } from "@/src/shared/config/storage";

/**
 * Store a media blob and return its bucket-relative path. Defaults to WebP —
 * every photo the uploader produces is re-encoded to it — but the logo passes
 * SVG through untouched, so the extension and content type are overridable.
 */
export async function uploadMedia(
  folder: string,
  blob: Blob,
  opts: { ext?: string; contentType?: string } = {},
): Promise<string> {
  const { ext = "webp", contentType = "image/webp" } = opts;
  const supabase = await createClient();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, {
      contentType,
      cacheControl: "31536000",
    });
  if (error) throw error;
  return path;
}

export async function removeMedia(path: string) {
  const supabase = await createClient();
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}
