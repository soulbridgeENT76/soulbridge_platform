import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { SITE } from "@shared/config/site";
import { mediaUrl } from "@shared/lib/media-url";
import { normalizeBrandSettings } from "../model/normalize";
import type { BrandSettings, SiteLogo } from "../model/types";

/** Invalidated by saveBrand via updateTag(). */
export const BRAND_TAG = "brand";

/**
 * Public read of site_settings, for the render path.
 *
 * Two things make this separate from getBrand():
 *   - it uses the cookie-free anon client, because reading cookies inside
 *     `"use cache"` throws and would strip prerendering from every public page;
 *   - it is cached under one tag, so the six places that render the logo share
 *     a single database read no matter how they are nested.
 *
 * saveBrand invalidates this with updateTag(BRAND_TAG), so the tag carries the
 * normal path. cacheLife is bounded rather than "max" because entries persist
 * in .next/cache between builds: with "max", a build run after an upload reused
 * the pre-upload entry and prerendered the fallback logo, and nothing short of
 * deleting the cache would have fixed it. A bounded profile self-heals from any
 * write the tag missed — a stale build entry, or a row edited straight in the
 * Supabase dashboard.
 */
async function getBrandPublic(): Promise<BrandSettings | null> {
  "use cache";
  cacheTag(BRAND_TAG);
  cacheLife("hours");

  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("brand, socials")
    .eq("id", 1)
    .single();

  // Degrade to the bundled defaults rather than 500-ing every page — and rather
  // than failing `next build`, which prerenders these pages with no database.
  if (error || !data) return null;
  return normalizeBrandSettings(data);
}

/**
 * The logo to render. Never null: with nothing uploaded (or the database
 * unreachable) this is the bundled SITE.logo, so no caller needs a fallback
 * branch of its own.
 */
export async function getSiteLogo(): Promise<SiteLogo> {
  const logo = (await getBrandPublic())?.brand.logo;
  const src = logo && mediaUrl(logo.path);
  return src ? { src, width: logo.width, height: logo.height } : SITE.logo;
}
