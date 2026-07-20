/** Resolved banner URLs. Mobile is a separate composition, not a crop. */
export type SlideBanner = {
  desktop: string | null;
  mobile: string | null;
};

/**
 * One full-screen home slide, as the slider consumes it. Assembled in the api
 * layer from a `page_contents` row whose slug is "home/<section>": the copy
 * comes from the columns, everything else from `metadata`.
 */
export type HomeSlide = {
  /** Row key ("home/about"). What the admin save action targets. */
  slug: string;
  /** metadata.slide_id — stable key for React and for the fallback palette. */
  id: string;
  order: number;
  /** Small uppercase label above the title (`subtitle` column). */
  eyebrow: string;
  /** Headline. Newlines are meaningful and rendered as line breaks. */
  titleKo: string;
  /** Body copy, or null on slides that render something else instead. */
  body: string | null;
  banner: SlideBanner;
  /** Text colour over the banner: "dark" ink on light, "light" paper on dark. */
  scheme: "light" | "dark";
  cta: { label: string; href: string };
  /** Public route this slide represents; null means it is never auto-hidden. */
  section: string | null;
  /** Renders the latest news list in place of `body`. */
  showsNews: boolean;
  newsLimit: number;
};
