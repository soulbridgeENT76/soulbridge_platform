import { createClient } from "./server";
import { MEDIA_BUCKET } from "@/src/shared/config/storage";

export async function uploadMedia(folder: string, blob: Blob): Promise<string> {
  const supabase = await createClient();
  const path = `${folder}/${crypto.randomUUID()}.webp`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, blob, {
      contentType: "image/webp",
      cacheControl: "31536000",
    });
  if (error) throw error;
  return path;
}

export async function removeMedia(path: string) {
  const supabase = await createClient();
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}
