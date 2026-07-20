import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { NAV } from "@shared/config/site";
import { mediaUrl } from "@shared/lib/media-url";
import type { HomeSlide } from "../model/types";

/** Invalidated by the admin save action once home editing is wired up. */
export const PAGE_CONTENT_TAG = "page-content";

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
 * is dropped here too, so home never advertises a page the header hides.
 *
 * Deliberately outside the cache: NAV is a code constant today, and folding it
 * into the cached entry would keep serving the old visibility after a deploy.
 */
export async function getVisibleHomeSlides(): Promise<HomeSlide[]> {
  const slides = await getHomeSlides();

  return slides.filter((slide) => {
    if (!slide.section) return true;
    const nav = NAV.find((n) => n.href === slide.section);
    return !nav || nav.active !== false;
  });
}
