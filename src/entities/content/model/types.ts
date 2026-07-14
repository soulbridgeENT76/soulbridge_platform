export type ContentCategory =
  | "YOUTUBE"
  | "DRAMA · OTT"
  | "WEBTOON"
  | "WEBNOVEL";

export type Content = {
  slug: string;
  title: string;
  category: ContentCategory;
  /** Release year / status line, e.g. "2027" or "2026 — ONGOING". */
  year: string;
  /** Short note, e.g. "교양 시리즈", "로크미디어 제휴". */
  note: string;
  /** Marks the hero/featured content on the home & contents pages. */
  featured?: boolean;
  /** Longer copy shown for featured items. */
  description?: string;
  /** Uppercase eyebrow for featured items, e.g. "YOUTUBE ORIGINAL". */
  badge?: string;
  /** Longer synopsis shown on the detail page (falls back to description/note). */
  synopsis?: string;
  /** YouTube video ID — shows an embedded player + link on the detail page. */
  youtubeId?: string;
};

/**
 * Single source of truth for the content thumbnail aspect ratio, shared by the
 * list card and the detail page. Keep list/detail in sync and make it easy to
 * feed one target size to an image-resizing server later.
 */
export const CONTENT_THUMB_RATIO = "16 / 9";

/** Category filter order used on the contents page (ALL is prepended in UI). */
export const CONTENT_CATEGORIES: ContentCategory[] = [
  "YOUTUBE",
  "DRAMA · OTT",
  "WEBTOON",
  "WEBNOVEL",
];
