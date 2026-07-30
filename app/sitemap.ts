import type { MetadataRoute } from "next";
import { absoluteUrl } from "@shared/config/site-url";
import { getContents } from "@entities/content";
import { getArtists } from "@entities/artist";
import { getPublishedNotices, isExternalNotice } from "@entities/notices";

/**
 * Served at /sitemap.xml. Generated rather than hand-written so CMS-managed
 * detail pages appear without an edit here — it reads the same cached readers
 * the pages use, so it costs no extra query beyond the three lists.
 *
 * Only public routes are listed: /admin, /auth and /protected are excluded (see
 * robots.ts). `lastModified` is omitted where the CMS keeps no revision date —
 * an invented timestamp is worse than none, since crawlers act on it.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [contents, artists, notices] = await Promise.all([
    getContents(),
    getArtists(),
    getPublishedNotices(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contents"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/artists"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/notice"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];

  const contentRoutes: MetadataRoute.Sitemap = contents.map((content) => ({
    url: absoluteUrl(`/contents/${content.ref}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const artistRoutes: MetadataRoute.Sitemap = artists.map((artist) => ({
    url: absoluteUrl(`/artists/${artist.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Link-type notices have no in-site page — they 404 — so they stay out.
  const noticeRoutes: MetadataRoute.Sitemap = notices
    .filter((notice) => !isExternalNotice(notice))
    .map((notice) => ({
      url: absoluteUrl(`/notice/${notice.ref}`),
      lastModified: notice.date,
      changeFrequency: "yearly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...contentRoutes, ...artistRoutes, ...noticeRoutes];
}
