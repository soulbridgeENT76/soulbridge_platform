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
 * Minimum width accepted at upload. 106px (largest on-screen use) × 3 for dense
 * mobile ≈ 318 → 512 with headroom, so the source has pixels to downscale from.
 *
 * The logo must stay transparent + monochrome: the footer flips it to white
 * with a CSS filter, which breaks on an opaque or multi-colour file.
 */
export const LOGO_MIN_WIDTH = 512;

/**
 * Fixed output box the logo is fitted into on upload (1.5:1 = 3:2), so every
 * stored logo is a predictable size and next/image gets stable dimensions
 * without a resizing pipeline. `contain` letterboxes onto a transparent canvas
 * — a wordmark must be fitted, never cropped. 512 × round(512 × 2/3) = 512 × 341.
 */
export const LOGO_OUTPUT = {
  width: 512,
  height: Math.round((512 * 2) / 3),
} as const satisfies UploadSize;
