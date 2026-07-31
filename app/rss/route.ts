import { getSiteBrand } from "@entities/brand";
import { getContents } from "@entities/content";
import { getPublishedNotices, isExternalNotice } from "@entities/notices";
import { SITE } from "@shared/config/site";
import { absoluteUrl } from "@shared/config/site-url";

/**
 * Served at /rss — extensionless because that is the form Naver Search Advisor
 * accepts for RSS submission. The Content-Type header is what identifies the
 * format, so the missing .xml costs nothing.
 *
 * Submitted alongside the sitemap. The sitemap lists every URL so crawlers can
 * find them at all; this carries only the freshly published ones, with their
 * text, so new posts get picked up quickly.
 *
 * Notices and contents only — those are the two sections that gain entries over
 * time. Artists and the static pages belong in the sitemap, not in a "what's
 * new" feed.
 */

/** Newest entries the feed carries. Naver reads the head of the list. */
const FEED_SIZE = 50;
/** How much body text goes into <description>. */
const SUMMARY_LENGTH = 300;

type FeedItem = {
  title: string;
  /** Absolute URL — also the guid, so it must be stable per entry. */
  link: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  category: string;
};

export async function GET() {
  const [brand, notices, contents] = await Promise.all([
    getSiteBrand(),
    getPublishedNotices(),
    getContents(),
  ]);

  // Link-type notices point off-site and have no page of ours to index, so they
  // stay out — the same rule the sitemap applies.
  const noticeItems: FeedItem[] = notices
    .filter((notice) => !isExternalNotice(notice))
    .map((notice) => ({
      title: notice.title,
      link: absoluteUrl(`/notice/${notice.ref}`),
      description: summarize(notice.body ?? ""),
      date: notice.date,
      category: notice.category,
    }));

  const contentItems: FeedItem[] = contents.map((content) => ({
    title: content.title,
    link: absoluteUrl(`/contents/${content.ref}`),
    // The card's one-line note reads better as a summary than the body does;
    // fall back to the synopsis when a content has no note.
    description: summarize(content.note || content.synopsis),
    date: content.date,
    category: content.category,
  }));

  const items = [...noticeItems, ...contentItems]
    // An entry with no date would sort to the end and publish as an invalid
    // pubDate, so drop it rather than emit a broken item.
    .filter((item) => item.date)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, FEED_SIZE);

  return new Response(renderFeed(brand.name, items), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Crawlers poll this; let the CDN answer most of those hits.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

function renderFeed(siteName: string, items: FeedItem[]) {
  const title = `${siteName} — ${SITE.tagline.en}`;
  // The newest entry rather than "now", so an unchanged feed renders byte-for-
  // byte identically and stays cacheable.
  const lastBuild = items[0] ? rfc822(items[0].date) : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(absoluteUrl("/"))}</link>
    <description>${escapeXml(collapse(SITE.description))}</description>
    <language>ko</language>
    <atom:link href="${escapeXml(absoluteUrl("/rss"))}" rel="self" type="application/rss+xml" />
${lastBuild ? `    <lastBuildDate>${lastBuild}</lastBuildDate>\n` : ""}${items
    .map(renderItem)
    .join("\n")}
  </channel>
</rss>
`;
}

function renderItem(item: FeedItem) {
  return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${rfc822(item.date)}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`;
}

/** RSS 2.0 wants RFC-822 dates; toUTCString() emits exactly that shape. */
function rfc822(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

/** CMS body text is free-form and multiline; feeds want one flat paragraph. */
function collapse(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function summarize(text: string) {
  const flat = collapse(text);
  return flat.length > SUMMARY_LENGTH
    ? `${flat.slice(0, SUMMARY_LENGTH).trimEnd()}…`
    : flat;
}

/**
 * Escaped rather than wrapped in CDATA: titles and bodies come from the CMS, so
 * a stray "]]>" would end the section early and break the whole feed.
 */
function escapeXml(text: string) {
  return text.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[char]!,
  );
}
