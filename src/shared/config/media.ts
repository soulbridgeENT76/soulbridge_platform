/**
 * Shared image aspect ratios — single source of truth so thumbnails stay
 * consistent site-wide and a future resizing server can rely on fixed crops.
 */

/** Landscape images: content thumbnails, video players, etc. */
export const LANDSCAPE_RATIO = "16 / 9";

/** Portrait images: artist profiles, leadership headshots, etc. */
export const PORTRAIT_RATIO = "3 / 4";
