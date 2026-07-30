/**
 * The site's canonical origin, used for `metadataBase`, the sitemap and
 * robots.txt. Server-side only — VERCEL_URL is not exposed to the browser, so
 * importing this from a client component would silently fall back to localhost.
 * Client code that needs an absolute URL should read NEXT_PUBLIC_SITE_URL.
 *
 * Prefer the configured canonical origin. On Vercel, use the project's
 * production domain rather than VERCEL_URL: the latter is the URL of one
 * deployment and makes Google reject its URLs when the sitemap is submitted
 * under the soulbridgeent.com Search Console property.
 */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

export const SITE_URL = configuredSiteUrl
  ? configuredSiteUrl
  : vercelProductionUrl
    ? `https://${vercelProductionUrl}`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://soulbridgeent.com";

/** Absolute URL for a site-relative path, e.g. "/about". */
export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
