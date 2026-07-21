/**
 * Pure YouTube helpers, safe on both server and client (the content form needs
 * them for the live preview, the save action for storing the id).
 */

/**
 * Pulls a YouTube video id from a watch / youtu.be / embed / shorts URL, or a
 * bare 11-char id. Returns null when nothing id-shaped is found — the caller
 * treats that as an invalid link.
 */
export function parseYoutubeId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  if (m) return m[1];
  if (/^[\w-]{11}$/.test(s)) return s;
  return null;
}

/** A video's thumbnail. mqdefault is 16:9 and always present. */
export function youtubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}
