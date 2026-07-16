"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateBrand, getBrand } from "@entities/brand";

export async function saveBrand(formData: FormData) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) throw new Error("Unauthorized");

  // Read back so fields the form does not expose (logo, description, copyright)
  // survive — updateBrand overwrites the whole jsonb column.
  const current = await getBrand();

  await updateBrand({
    brand: {
      ...current.brand,
      name: String(formData.get("name") ?? ""),
      intro: String(formData.get("intro") ?? ""),
      logo: String(formData.get("logo") ?? ""),
    },
    socials: {
      ...current.socials,
      instagram: String(formData.get("instagram") ?? ""),
      youtube: String(formData.get("youtube") ?? ""),
      messenger: String(formData.get("messenger") ?? ""),
    },
  });

  revalidatePath("/admin/brand");
  revalidatePath("/admin/contact");
  revalidatePath("/admin/footer");
  // The header and footer render on every public page.
  revalidatePath("/", "layout");
}
