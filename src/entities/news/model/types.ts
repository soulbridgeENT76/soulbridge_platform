export type NewsCategory = "PRESS" | "NOTICE";

export type NewsItem = {
  slug: string;
  /** ISO date (YYYY-MM-DD) for sorting; display format is derived in UI. */
  date: string;
  category: NewsCategory;
  title: string;
};

export const NEWS_CATEGORIES: NewsCategory[] = ["PRESS", "NOTICE"];
