import { createClient } from "@/lib/supabase/server";
import { normalizeBrandSettings } from "../model/normalize";
import type { BrandSettings } from "../model/types";

/**
 * Server-only, authed, uncached: reads the single site_settings row through the
 * cookie-bearing client. For the admin editor and for saveBrand, which both
 * need the true current row rather than a cached copy.
 *
 * The render path uses getBrandPublic() instead — it must not read cookies.
 */
export async function getBrand(): Promise<BrandSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("brand, socials")
    .eq("id", 1)
    .single();
  if (error) throw error;

  return normalizeBrandSettings(data);
}
