import { createClient } from "@/lib/supabase/server";
import type { BrandSettings } from "../model/types";

/** Server-only: reads the single site_settings row. */
export async function getBrand(): Promise<BrandSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select("brand, socials")
    .eq("id", 1)
    .single();
  if (error) throw error;

  return data as BrandSettings;
}
