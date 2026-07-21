import type { Notice } from "./types";

/** Columns every notice reader selects. */
export const NOTICE_SELECT =
  "id, slug, title, content, type, reference_url, category, is_active, published_at" as const;

export type NoticeRowData = {
  id: string;
  slug: string | null;
  title: string;
  content: string;
  type: number;
  reference_url: string | null;
  category: string;
  is_active: boolean;
  published_at: string | null;
};

/** The UTC date (YYYY-MM-DD) of a timestamp, or "" when unset. */
function isoDate(ts: string | null): string {
  if (!ts) return "";
  return new Date(ts).toISOString().slice(0, 10);
}

/** Maps a row to the shape the UI renders. */
export function toNotice(row: NoticeRowData): Notice {
  return {
    id: row.id,
    slug: row.slug,
    ref: row.slug || row.id,
    date: isoDate(row.published_at),
    category: row.category,
    title: row.title,
    body: row.content || undefined,
    linkType: row.type === 1 ? "external" : "article",
    externalUrl: row.reference_url || undefined,
    active: row.is_active,
  };
}
