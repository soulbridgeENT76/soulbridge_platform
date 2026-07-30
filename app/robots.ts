import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@shared/config/site-url";

/**
 * Served at /robots.txt. The admin console, the auth flow and the signed-in
 * area have nothing to index and would only leak route names into search
 * results, so they are excluded.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/auth", "/protected"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
