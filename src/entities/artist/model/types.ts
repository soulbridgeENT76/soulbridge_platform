export type ArtistRole = "방송인" | "배우" | "크리에이터";

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
};
