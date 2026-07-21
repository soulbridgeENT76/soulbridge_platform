import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { mediaUrl } from "@shared/lib/media-url";
import type { HomeSlide } from "../model/types";
import { getHiddenSectionSlugs, sectionSlug } from "./get-sections";

// Re-exported for the readers and actions that import it from here.
export { PAGE_CONTENT_TAG } from "./tags";
import { PAGE_CONTENT_TAG } from "./tags";

/** Home slides live under this slug prefix: "home/about", "home/contents", … */
const HOME_SLUG_PREFIX = "home/";

type Row = {
  slug: string;
  subtitle: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
};

/**
 * Shape one row into a slide. Every `metadata` read is defensive: the column is
 * free-form jsonb with no schema behind it, so a hand-edited row must degrade
 * to something renderable rather than throw halfway down the home page.
 */
function toSlide(row: Row): HomeSlide {
  const meta = row.metadata ?? {};
  const banner = (meta.banner ?? {}) as Record<string, unknown>;
  const cta = (meta.cta ?? {}) as Record<string, unknown>;

  return {
    slug: row.slug,
    id: typeof meta.slide_id === "string" ? meta.slide_id : row.slug,
    order: typeof meta.order === "number" ? meta.order : Number.MAX_SAFE_INTEGER,
    eyebrow: row.subtitle,
    titleKo: row.title,
    body: row.description,
    banner: {
      desktop: mediaUrl(
        typeof banner.desktop === "string" ? banner.desktop : null,
      ),
      mobile: mediaUrl(typeof banner.mobile === "string" ? banner.mobile : null),
    },
    // Guessing wrong here makes copy invisible against the banner, so anything
    // but an explicit "light" falls back to ink on a light background.
    scheme: meta.scheme === "light" ? "light" : "dark",
    cta: {
      label: typeof cta.label === "string" ? cta.label : "",
      href: typeof cta.href === "string" ? cta.href : "/",
    },
    section: typeof meta.section === "string" ? meta.section : null,
    showsNews: meta.shows_news === true,
    newsLimit: typeof meta.news_limit === "number" ? meta.news_limit : 3,
  };
}

/**
 * All home slides, ordered — including ones hidden from the public site. The
 * admin editor uses this so a switched-off section is still editable.
 *
 * Cached and cookie-free for the same reasons as getBrandPublic: reading
 * cookies would strip prerendering from the home page, and one cached entry
 * serves every visitor until the tag is invalidated.
 */
export async function getHomeSlides(): Promise<HomeSlide[]> {
  "use cache";
  cacheTag(PAGE_CONTENT_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("page_contents")
      .select("slug, subtitle, title, description, metadata")
      .like("slug", `${HOME_SLUG_PREFIX}%`);

    if (error || !data) return [];
    return (data as Row[]).map(toSlide).sort((a, b) => a.order - b.order);
  } catch {
    // An unreachable database yields an empty home rather than a 500 — and lets
    // `next build` prerender before the project is configured.
    return [];
  }
}

/**
 * Slides actually shown to visitors. A slide whose section menu is switched off
 * (page_contents.is_active = false on the section it points at) is dropped here
 * too, so home never advertises a page the header hides.
 *
 * Both reads share the page-content tag, so the admin toggle invalidates the
 * home banner and the header nav together.
 */
export async function getVisibleHomeSlides(): Promise<HomeSlide[]> {
  const [slides, hidden] = await Promise.all([
    getHomeSlides(),
    getHiddenSectionSlugs(),
  ]);

  return slides.filter((slide) => {
    if (!slide.section) return true;
    return !hidden.has(sectionSlug(slide.section));
  });
}
