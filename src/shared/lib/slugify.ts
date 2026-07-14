/**
 * Turn a title into a URL slug. Keeps Hangul so Korean titles stay readable
 * (e.g. "새 소식 제목" → "새-소식-제목"). Backend may re-derive or dedupe.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
