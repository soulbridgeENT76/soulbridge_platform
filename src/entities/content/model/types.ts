import { LANDSCAPE_RATIO } from "@shared/config/media";

export type ContentCategory =
  | "YOUTUBE"
  | "DRAMA · OTT"
  | "WEBTOON"
  | "WEBNOVEL";

/** How a content's media renders: an uploaded image or a YouTube embed. */
export type ContentMediaType = "image" | "youtube";

export type Content = {
  id: string;
  /** Custom URL slug, or null — then the id is the identifier. */
  slug: string | null;
  /** Routing identifier: the custom slug if set, else the id (uuid). */
  ref: string;
  title: string;
  /** One of CONTENT_CATEGORIES — stored as free text in the DB. */
  category: string;
  /** Release year / status line, e.g. "2027" or "2026 — ONGOING". */
  year: string;
  /** Short note under the title, e.g. "교양 시리즈". */
  note: string;
  /** Detail-page body copy. */
  synopsis: string;
  /** Optional related link, shown as a button on the detail page. */
  referenceUrl?: string;
  mediaType: ContentMediaType;
  /** Resolved image URL when mediaType is "image", else null. */
  thumbnail: string | null;
  /** YouTube video id when mediaType is "youtube", else null. */
  youtubeId: string | null;
  /**
   * A thumbnail to show in lists/cards: the uploaded image for image media, the
   * video's thumbnail for YouTube media, or null when neither is set.
   */
  preview: string | null;
};

/**
 * Single source of truth for the content thumbnail aspect ratio, shared by the
 * list card and the detail page.
 */
export const CONTENT_THUMB_RATIO = LANDSCAPE_RATIO;

/** Category filter order used on the contents page (ALL is prepended in UI). */
export const CONTENT_CATEGORIES: ContentCategory[] = [
  "YOUTUBE",
  "DRAMA · OTT",
  "WEBTOON",
  "WEBNOVEL",
];
