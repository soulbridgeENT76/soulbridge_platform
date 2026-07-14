export type ArtistRole = "방송인" | "배우" | "크리에이터";

/** A single filmography / activity entry. */
export type ArtistWork = {
  year: string;
  title: string;
  /** Role in the work, e.g. "주연", "진행", "내레이션". */
  role: string;
};

/** A social link shown on the detail page. */
export type ArtistSocial = {
  /** Uppercase label, e.g. "INSTAGRAM", "YOUTUBE". */
  label: string;
  href: string;
};

export type Artist = {
  slug: string;
  nameKo: string;
  nameEn: string;
  role: ArtistRole;
  /** Optional headline for the home spotlight slide. */
  spotlight?: {
    titleEn: string;
    description: string;
  };
  /** Profile bio shown on the detail page (multiline free text). */
  bio?: string;
  /** Filmography / activities. */
  works?: ArtistWork[];
  /** Social links. */
  socials?: ArtistSocial[];
};
