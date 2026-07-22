import type { SocialKey, SocialLink } from "@shared/config/socials";

/**
 * An uploaded logo — an SVG stored as-is, or a WebP re-encoded from a PNG.
 * `path` is the Storage path inside MEDIA_BUCKET ("logo/<uuid>.svg|.webp"), NOT
 * a URL — wrap it with mediaUrl() at render time so the bucket and host stay in
 * one place.
 *
 * The dimensions travel with the path rather than living in a sibling field:
 * the header <img> and the hero's CSS mask both need them, and splitting them
 * off would let a logo exist without a size. They carry the artwork's intrinsic
 * ratio (SVG viewBox, or the encoded WebP's pixels).
 */
export type BrandLogo = {
  path: string;
  width: number;
  height: number;
};

/**
 * Render-ready logo: an absolute URL plus intrinsic dimensions. Either the
 * uploaded logo resolved through mediaUrl(), or the bundled SITE.logo — the
 * render path never has to tell the two apart.
 */
export type SiteLogo = {
  src: string;
  width: number;
  height: number;
};

export type Brand = {
  /** null falls back to the bundled SITE.logo. */
  logo: BrandLogo | null;
  name: string;
  /** One-line company intro shown next to the footer logo. */
  intro: string;
  /** Copyright notice WITHOUT the year — the year is prepended automatically. */
  copyright: string;
};

/**
 * Fixed keys rather than a list: SOCIAL_META maps key→icon in code, so a new
 * network needs a deploy anyway. Deriving the shape from SOCIAL_KEYS keeps the
 * stored columns and the renderable registry from drifting apart. Empty string
 * means unset.
 */
export type Socials = Record<SocialKey, string>;

export type BrandSettings = {
  brand: Brand;
  socials: Socials;
};

/**
 * Render-ready brand text and links: the CMS values with the bundled SITE
 * defaults already substituted for anything left blank. The render path never
 * has to decide what "unset" should look like.
 */
export type SiteBrand = {
  name: string;
  intro: string;
  /** Only the networks actually filled in, in registry order. */
  socials: SocialLink[];
};
