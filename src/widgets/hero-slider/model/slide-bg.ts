/**
 * Flat brand colour behind each slide.
 *
 * Not CMS data: the admin uploads banner images, not colours, so this is what
 * shows while a banner loads and on slides that have none. Keeping it in code
 * also rules out the accident an editable colour would invite — a light colour
 * paired with light text, leaving the copy invisible.
 *
 * Keyed by `metadata.slide_id`. An unknown id falls back to paper.
 */
const SLIDE_BG: Record<string, string> = {
  about: "#DCD2EC",
  contents: "#F4F2EE",
  artists: "#B7A9BC",
  notice: "#E5E2DC",
  contact: "#A493A9",
};

const DEFAULT_BG = "#F4F2EE";

export function slideBg(slideId: string): string {
  return SLIDE_BG[slideId] ?? DEFAULT_BG;
}
