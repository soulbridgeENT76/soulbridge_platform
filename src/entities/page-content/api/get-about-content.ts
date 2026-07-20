import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { mediaUrl } from "@shared/lib/media-url";
import { PAGE_CONTENT_TAG } from "./get-home-slides";

/** The fixed leadership block. `photo` is a resolved URL, not a storage path. */
export type AboutLeadership = {
  label: string;
  role: string;
  name: string;
  bio: string;
  points: string[];
  photo: string | null;
};

/**
 * A "label + title + cards" block. The public page numbers these by position
 * (leadership is 01, so these start at 02) rather than storing an index, which
 * would go stale the moment a section is reordered or removed.
 */
export type AboutSection = {
  label: string;
  title: string;
  items: { title: string; description: string }[];
};

export type AboutContent = {
  leadership: AboutLeadership | null;
  sections: AboutSection[] | null;
};

const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback;

function toLeadership(raw: unknown): AboutLeadership | null {
  if (!raw || typeof raw !== "object") return null;
  const l = raw as Record<string, unknown>;

  return {
    label: str(l.label, "LEADERSHIP"),
    role: str(l.role),
    name: str(l.name),
    bio: str(l.bio),
    points: Array.isArray(l.points) ? l.points.filter(
      (p): p is string => typeof p === "string",
    ) : [],
    photo: mediaUrl(typeof l.photo === "string" ? l.photo : null),
  };
}

function toSections(raw: unknown): AboutSection[] | null {
  if (!Array.isArray(raw)) return null;

  return raw.map((s) => {
    const sec = (s ?? {}) as Record<string, unknown>;
    const items = Array.isArray(sec.items) ? sec.items : [];
    return {
      label: str(sec.label),
      title: str(sec.title),
      items: items.map((i) => {
        const item = (i ?? {}) as Record<string, unknown>;
        return { title: str(item.title), description: str(item.description) };
      }),
    };
  });
}

/**
 * Leadership and the variable sections of the ABOUT page, stored in that row's
 * `metadata`. Both come back null until the page has been saved once from the
 * admin — the caller falls back to the bundled constants, which is what the
 * page rendered before the CMS existed.
 *
 * Every field is read defensively: metadata is schema-less jsonb, so a
 * hand-edited row must degrade rather than throw mid-page.
 */
export async function getAboutContent(): Promise<AboutContent> {
  "use cache";
  cacheTag(PAGE_CONTENT_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("page_contents")
      .select("metadata")
      .eq("slug", "about")
      .single();

    if (error || !data) return { leadership: null, sections: null };
    const meta = (data.metadata ?? {}) as Record<string, unknown>;

    return {
      leadership: toLeadership(meta.leadership),
      sections: toSections(meta.sections),
    };
  } catch {
    return { leadership: null, sections: null };
  }
}
