export type Brand = {
  /** null falls back to the text wordmark. */
  logo: string | null;
  name: string;
  /** One-line company intro shown next to the footer logo. */
  intro: string;
  /** Copyright notice WITHOUT the year — the year is prepended automatically. */
  copyright: string;
};

/**
 * Fixed keys rather than a list: social-links.tsx maps label→icon in code, so a
 * new network needs a deploy anyway. Empty string means unset.
 */
export type Socials = {
  instagram: string;
  youtube: string;
  messenger: string;
};

export type BrandSettings = {
  brand: Brand;
  socials: Socials;
};
