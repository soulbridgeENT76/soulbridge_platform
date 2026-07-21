import type { SocialLink } from "@shared/config/socials";

/**
 * One career entry. `label` is the year or range as typed ("2018",
 * "2020 — 2024", "2023 — "), so it is free text rather than a date: the roster
 * mixes single years, ranges and open-ended runs.
 */
export type ArtistWork = {
  label: string;
  description: string;
};

/**
 * An artist's social link. Keyed by the shared SocialKey registry, the same one
 * the site footer resolves icons through — see @shared/config/socials.
 */
export type ArtistSocial = SocialLink;

export type Artist = {
  id: string;
  /** URL identifier. Derived from the English name once, then held fixed. */
  slug: string;
  nameKo: string;
  nameEn: string;
  /** Free text ("방송인", "배우", "크리에이터", …) — the admin field is open. */
  role: string;
  bio: string;
  /** Resolved URL, not a Storage path — null when nothing is uploaded. */
  photo: string | null;
  works: ArtistWork[];
  socials: ArtistSocial[];
};
