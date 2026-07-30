/**
 * The site's canonical origin, used for `metadataBase`, the sitemap and
 * robots.txt. Server-side only — VERCEL_URL is not exposed to the browser, so
 * importing this from a client component would silently fall back to localhost.
 * Client code that needs an absolute URL should read NEXT_PUBLIC_SITE_URL.
 *
 * Order: the configured production domain, then the deployment URL Vercel
 * injects (preview builds), then local development.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

/** Absolute URL for a site-relative path, e.g. "/about". */
export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
