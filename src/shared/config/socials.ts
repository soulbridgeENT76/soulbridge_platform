import type { IconType } from "react-icons";
import { SiInstagram, SiYoutube } from "react-icons/si";
import { IoChatbubble } from "react-icons/io5";

/**
 * Every social network the site can render, in display order.
 *
 * The key is the contract: it is what the database stores (`site_settings.
 * socials` uses these exact column names) and what an artist profile stores, so
 * one registry serves both. Labels are derived here rather than persisted —
 * storing a display string alongside the key would let the two drift, and the
 * icon map could then miss.
 *
 * Adding a network means adding a key here plus its entry in SOCIAL_META; both
 * the brand footer and every artist profile pick it up with no further changes.
 */
export const SOCIAL_KEYS = ["instagram", "youtube", "messenger"] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

type SocialMeta = {
  /** Uppercase display name — used for aria-label and admin previews. */
  label: string;
  Icon: IconType;
  /**
   * Optical size tweak: glyphs fill their box differently, so they read larger
   * or smaller at the same px size. Nudge each to match the others.
   */
  opticalScale?: number;
  /** Vertical nudge in px (negative = up) to align optical centers. */
  nudgeY?: number;
};

/** MESSENGER is a generic chat glyph, so any messenger link can use it. */
export const SOCIAL_META: Record<SocialKey, SocialMeta> = {
  instagram: { label: "INSTAGRAM", Icon: SiInstagram },
  youtube: { label: "YOUTUBE", Icon: SiYoutube, opticalScale: 1.15 },
  messenger: {
    label: "MESSENGER",
    Icon: IoChatbubble,
    opticalScale: 1.05,
    nudgeY: -0.75,
  },
};

/** A resolved, renderable social link. */
export type SocialLink = { key: SocialKey; href: string };

/**
 * Rows written before the keys were fixed — and hand-entered values — do not
 * always match a key exactly. Map what we can rather than dropping the link.
 */
const ALIASES: Record<string, SocialKey> = {
  kakao: "messenger",
  kakaotalk: "messenger",
  telegram: "messenger",
};

/** " · "-joined display labels — for admin cards previewing what is set. */
export function socialSummary(links: readonly SocialLink[]): string {
  return links.map((l) => SOCIAL_META[l.key].label).join(" · ");
}

/** Resolves a stored/typed string to a key, or null if it is not a network. */
export function toSocialKey(raw: string): SocialKey | null {
  const k = raw.trim().toLowerCase();
  if ((SOCIAL_KEYS as readonly string[]).includes(k)) return k as SocialKey;
  return ALIASES[k] ?? null;
}

/**
 * Turns a stored `{ instagram: "...", youtube: "" }` map into an ordered list
 * of links, dropping any network left blank.
 *
 * Order comes from SOCIAL_KEYS, not from the object's own key order: a JSON
 * column round-trips its keys in insertion order, which would otherwise let the
 * icon row reshuffle itself depending on how the row was last written.
 */
export function toSocialLinks(
  source: Partial<Record<SocialKey, string | null>> | null | undefined
): SocialLink[] {
  if (!source) return [];
  return SOCIAL_KEYS.flatMap((key) => {
    const href = source[key]?.trim();
    return href ? [{ key, href }] : [];
  });
}
