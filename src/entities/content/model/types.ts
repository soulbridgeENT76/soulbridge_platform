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

/** Category filter order used on the contents page (ALL is prepended in UI). */
export const CONTENT_CATEGORIES: ContentCategory[] = [
  "YOUTUBE",
  "DRAMA · OTT",
  "WEBTOON",
  "WEBNOVEL",
];
