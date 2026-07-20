/**
 * An uploaded logo. `path` is the Storage path inside MEDIA_BUCKET
 * ("logo/<uuid>.webp"), NOT a URL — wrap it with mediaUrl() at render time so
 * the bucket and host stay in one place.
 *
 * The dimensions travel with the path rather than living in a sibling field:
 * next/image and the hero's CSS mask both need them, and splitting them off
 * would let a logo exist without a size. `height` is always LOGO_OUTPUT_HEIGHT;
 * `width` follows the source ratio, so it differs per file.
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
 * Fixed keys rather than a list: social-links.tsx maps label→icon in code, so a
 * new network needs a deploy anyway. Empty string means unset.
 */
export type Socials = {
  instagram: string;
  youtube: string;
  messenger: string;
};

export type BrandSettings = {
  brand: Brand;
  socials: Socials;
};
