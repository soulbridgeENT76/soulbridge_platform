export type NewsCategory = "NEWS" | "NOTICE";

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
  /**
   * Publish switch. Only `true` shows on the public site; new items start
   * inactive so registering does not publish immediately.
   */
  active?: boolean;
};

export const NEWS_CATEGORIES: NewsCategory[] = ["NEWS", "NOTICE"];
