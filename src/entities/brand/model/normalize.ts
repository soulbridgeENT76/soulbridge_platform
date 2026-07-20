import type { BrandLogo, BrandSettings } from "./types";

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
