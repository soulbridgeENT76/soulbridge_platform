export type NewsCategory = "NEWS" | "NOTICE";

/**
 * How a row behaves when clicked.
 * - "article" (default): opens the in-site detail page showing `body`, with
 *   `externalUrl` offered as an optional attached source link.
 * - "external": the row jumps straight to `externalUrl` in a new tab; there is
 *   no in-site detail page.
 */
export type NewsLinkType = "article" | "external";

export type NewsItem = {
  slug: string;
  /** ISO date (YYYY-MM-DD) for sorting; display format is derived in UI. */
  date: string;
  category: NewsCategory;
  title: string;
  /** Author / writer shown on the detail page. */
  author?: string;
  /** Full body shown on the detail page (multiline free text, CMS-editable). */
  body?: string;
  /** Display mode chosen in the CMS. Omitted / undefined means "article". */
  linkType?: NewsLinkType;
  /**
   * External URL. Click target for "external" rows; optional attached source
   * link on "article" detail pages.
   */
  externalUrl?: string;
  /**
   * Publish switch. Only `true` shows on the public site; new items start
   * inactive so registering does not publish immediately.
   */
  active?: boolean;
};

// Filter tabs render as ALL / NOTICE / NEWS in this order.
export const NEWS_CATEGORIES: NewsCategory[] = ["NOTICE", "NEWS"];
