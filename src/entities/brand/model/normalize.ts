import { SITE } from "@shared/config/site";
import { toSocialLinks } from "@shared/config/socials";
import type { BrandLogo, BrandSettings, SiteBrand } from "./types";

/**
 * `brand.logo` was a plain string before the upload feature landed, and a bug
 * in saveBrand wrote the literal "[object File]" into it. A migration cleans
 * that up, but a teammate's stale database or a restored dump will not have run
 * it — so every read normalizes rather than trusting the column's shape.
 *
 * Anything that is not a complete logo object degrades to null, which renders
 * the bundled SITE.logo. A wrong-shaped row should show the default logo, not
 * crash the header on every page.
 */
export function normalizeLogo(raw: unknown): BrandLogo | null {
  if (!raw || typeof raw !== "object") return null;
  const { path, width, height } = raw as Record<string, unknown>;
  if (typeof path !== "string" || path === "") return null;
  if (typeof width !== "number" || !Number.isFinite(width) || width <= 0) {
    return null;
  }
  if (typeof height !== "number" || !Number.isFinite(height) || height <= 0) {
    return null;
  }
  return { path, width, height };
}

/**
 * Applies the bundled SITE defaults to produce render-ready brand text.
 *
 * Shared by the public render path and the admin preview cards so the two agree
 * on what a blank field shows — an operator comparing the two screens should
 * never see them disagree.
 *
 * Blank is "unset", not an intentional empty string: clearing 회사명 should
 * bring the default back rather than leave a nameless header. Socials differ —
 * a cleared network is genuinely removed, as there is no default link to use.
 */
export function resolveSiteBrand(settings: BrandSettings | null): SiteBrand {
  return {
    name: settings?.brand.name?.trim() || SITE.name,
    intro: settings?.brand.intro?.trim() || SITE.intro,
    socials: toSocialLinks(settings?.socials),
  };
}

/** Shapes a raw `site_settings` row into BrandSettings. */
export function normalizeBrandSettings(raw: unknown): BrandSettings {
  const { brand, socials } = (raw ?? {}) as Record<string, unknown>;
  const b = (brand ?? {}) as Record<string, unknown>;

  return {
    brand: {
      ...(b as unknown as BrandSettings["brand"]),
      logo: normalizeLogo(b.logo),
    },
    socials: (socials ?? {}) as BrandSettings["socials"],
  };
}
