export type NoticeCategory = "NEWS" | "NOTICE";

/**
 * How a row behaves when clicked.
 * - "article" (default): opens the in-site detail page showing `body`, with
 *   `externalUrl` offered as an optional related link.
 * - "external": the row jumps straight to `externalUrl` in a new tab.
 */
export type NoticeLinkType = "article" | "external";

export type Notice = {
  id: string;
  /** Custom URL slug, or null — then the id is the identifier. */
  slug: string | null;
  /** Routing identifier: the custom slug if set, else the id (uuid). */
  ref: string;
  /** ISO date (YYYY-MM-DD) derived from published_at; UI formats it. */
  date: string;
  /** One of NOTICE_CATEGORIES — stored as free text in the DB. */
  category: string;
  title: string;
  /** Full body shown on the detail page (multiline free text). */
  body?: string;
  /** Display mode. Omitted / undefined means "article". */
  linkType?: NoticeLinkType;
  /** External URL: click target for "external" rows; related link otherwise. */
  externalUrl?: string;
  /** Publish switch. Only `true` (and a past date) shows on the public site. */
  active?: boolean;
};

// Filter tabs render as ALL / NOTICE / NEWS in this order. DB-managed; this is
// the fallback when the category table is empty or unreachable.
export const NOTICE_CATEGORIES: NoticeCategory[] = ["NOTICE", "NEWS"];
