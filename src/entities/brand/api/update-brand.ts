import { createClient } from "@/lib/supabase/server";
import type { BrandSettings } from "../model/types";

/**
 * Server-only. Deliberately not a server action: "use server" would export this
 * as a public HTTP endpoint, so a browser could call it straight past any auth
 * check. The action in the features layer owns that check and calls this.
 *
 * Touches only `brand` and `socials`, so /admin/contact writing `contact` on the
 * same row does not clobber it.
 */
export async function updateBrand({
  brand,
  socials,
}: BrandSettings): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({ brand, socials })
    .eq("id", 1);

  if (error) throw error;
}
