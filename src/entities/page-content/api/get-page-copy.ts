import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { PAGE_CONTENT_TAG } from "./get-home-slides";

/** The heading block every section page renders above its content. */
export type PageCopy = {
  /** Small uppercase label (`subtitle` column). */
  eyebrow: string;
  /** Headline. Newlines are meaningful and rendered as line breaks. */
  title: string;
  description: string | null;
};

/**
 * Heading copy for one section page ("about", "contents", "artists", …).
 *
 * Returns null when the row is missing or the database is unreachable, so the
 * caller can fall back to its bundled copy rather than render an empty header.
 *
 * Cached and cookie-free like the other public readers — reading cookies here
 * would strip prerendering from every section page.
 */
export async function getPageCopy(slug: string): Promise<PageCopy | null> {
  "use cache";
  cacheTag(PAGE_CONTENT_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("page_contents")
      .select("subtitle, title, description")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return {
      eyebrow: data.subtitle,
      title: data.title,
      description: data.description,
    };
  } catch {
    return null;
  }
}
