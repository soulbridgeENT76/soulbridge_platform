/**
 * Shared image aspect ratios — single source of truth so thumbnails stay
 * consistent site-wide and a future resizing server can rely on fixed crops.
 */

/** Landscape images: content thumbnails, video players, etc. */
export const LANDSCAPE_RATIO = "16 / 9";

/** Portrait images: artist profiles, leadership headshots, etc. */
export const PORTRAIT_RATIO = "3 / 4";

export type UploadSize = { width: number; height: number };

/**
 * Required upload sizes. These are enforced — the CMS rejects any file whose
 * pixel dimensions do not match exactly, so the resizing server always gets a
 * predictable original. Derived from the largest place each image is displayed
 * × retina density, with headroom to downscale from.
 */
export const UPLOAD_SIZE = {
  /** Content thumbnails + detail images. */
  landscape: { width: 2560, height: 1440 },
  /** Artist / leadership profiles. */
  portrait: { width: 1200, height: 1600 },
  /** Home hero banner, desktop. */
  bannerDesktop: { width: 2560, height: 1440 },
  /** Home hero banner, mobile (separate composition, not a crop). */
  bannerMobile: { width: 1440, height: 2560 },
} as const satisfies Record<string, UploadSize>;

/** "2560 × 1440" for display in the CMS. */
export const formatSize = (s: UploadSize) => `${s.width} × ${s.height}`;

/**
 * Minimum height accepted at upload. The logo is sized by height everywhere it
 * appears (`h-12 w-auto` in the header, footer and menu), so height — not width
 * — decides how sharp it renders: a wide but short export would clear a width
 * check and still look soft. 48px (tallest on-screen use) × 3 for dense mobile
 * ≈ 144, and 512 leaves headroom for the hero wordmark, which masks the same
 * file several hundred px wide.
 *
 * The logo must stay transparent + monochrome: the footer flips it to white
 * with a CSS filter, which breaks on an opaque or multi-colour file.
 */
export const LOGO_MIN_HEIGHT = 512;

/**
 * Height every stored logo is scaled to on upload; the width follows the source
 * ratio. Fitting into a fixed box instead would letterbox the wordmark onto a
 * transparent canvas, and since the site sizes the logo by height that baked-in
 * padding shrinks the artwork everywhere it appears — the very thing the
 * uploader rejects source files for.
 */
export const LOGO_OUTPUT_HEIGHT = 512;
