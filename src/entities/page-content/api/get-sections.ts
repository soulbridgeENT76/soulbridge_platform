import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/server";
import { NAV, type NavItem } from "@shared/config/site";
import { PAGE_CONTENT_TAG } from "./tags";

/** A section page's slug from its public route: "/artists" → "artists". */
export const sectionSlug = (href: string) => href.replace(/^\//, "");

/**
 * Section slugs whose "메뉴 노출" is switched off (page_contents.is_active =
 * false).
 *
 * Returns the *hidden* set, not the visible one, so the safe default on any
 * failure is an empty set — nothing hidden. Losing the database should leave
 * the whole menu showing, never blank it.
 *
 * Cookie-free and cached under the shared page-content tag: the header renders
 * on every page and the home slider reads the same entry, and the admin toggle
 * invalidates the tag on save.
 */
export async function getHiddenSectionSlugs(): Promise<Set<string>> {
  "use cache";
  cacheTag(PAGE_CONTENT_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("page_contents")
      .select("slug, is_active")
      // Section rows only — home slides live under "home/…" and carry their own
      // visibility through the section they point at.
      .not("slug", "like", "home/%");

    if (error || !data) return new Set();
    return new Set(
      data.filter((r) => r.is_active === false).map((r) => r.slug as string)
    );
  } catch {
    return new Set();
  }
}

/**
 * The header/menu items to show. NAV supplies label + href + order (a code
 * constant, since a new section needs a deploy anyway); the DB supplies the
 * live on/off. The static `active` stays a build-time kill switch layered on
 * top of it.
 */
export async function getVisibleNav(): Promise<NavItem[]> {
  const hidden = await getHiddenSectionSlugs();
  return NAV.filter(
    (item) => item.active !== false && !hidden.has(sectionSlug(item.href))
  );
}

/**
 * A section's current "메뉴 노출" state, read through the authed, uncached
 * client — the admin toggle must reflect the true stored value, not a cached
 * copy a save may already have superseded. Missing row defaults to visible.
 */
export async function getSectionActive(slug: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_contents")
    .select("is_active")
    .eq("slug", slug)
    .single();
  return (data?.is_active as boolean | undefined) ?? true;
}

/** Server-only write of a section's visibility. The feature action owns auth. */
export async function setSectionActive(
  slug: string,
  active: boolean
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("page_contents")
    .update({ is_active: active })
    .eq("slug", slug);
  if (error) throw error;
}
