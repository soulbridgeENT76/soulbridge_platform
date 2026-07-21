import type { Notice } from "./types";

/** Format an ISO date as the design's "YYYY. MM. DD". */
export function formatNoticeDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}. ${m}. ${d}`;
}

/**
 * True when a row should jump straight to an external URL instead of opening
 * the in-site detail page. Requires both the mode and a URL to be set.
 */
export const isExternalNotice = (item: Notice): boolean =>
  item.linkType === "external" && Boolean(item.externalUrl);

/** Where a row links to: the external URL, or the in-site detail page. */
export const getNoticeHref = (item: Notice): string =>
  isExternalNotice(item) ? item.externalUrl! : `/notice/${item.ref}`;
