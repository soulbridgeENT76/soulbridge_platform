import { mediaUrl } from "@shared/lib/media-url";
import { youtubeThumbnail } from "@shared/lib/youtube";
import type { Content } from "./types";

/** Columns every content reader selects, shared so they can never disagree. */
export const CONTENT_SELECT =
  "id, slug, category, title, year, description, content, thumbnail_url, thumbnail_type, created_at" as const;

export type ContentRow = {
  id: string;
  slug: string | null;
  category: string;
  title: string;
  year: string;
  description: string | null;
  content: string;
  thumbnail_url: string | null;
  /** 0 = image, 1 = youtube. */
  thumbnail_type: number;
};

/** Maps a row to the shape the UI renders. */
export function toContent(row: ContentRow): Content {
  const isYoutube = row.thumbnail_type === 1;
  // For image, thumbnail_url is a Storage path; for youtube it holds the id.
  const thumbnail = isYoutube ? null : mediaUrl(row.thumbnail_url);
  const youtubeId = isYoutube ? row.thumbnail_url || null : null;
  return {
    id: row.id,
    slug: row.slug,
    // The identifier used in URLs: a custom slug wins, else the id.
    ref: row.slug || row.id,
    title: row.title,
    category: row.category,
    year: row.year,
    note: row.description ?? "",
    synopsis: row.content ?? "",
    mediaType: isYoutube ? "youtube" : "image",
    thumbnail,
    youtubeId,
    preview: youtubeId ? youtubeThumbnail(youtubeId) : thumbnail,
  };
}
