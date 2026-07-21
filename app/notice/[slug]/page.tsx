import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@widgets/page-shell";
import {
  getPublishedNotices,
  getNoticeByRef,
  isExternalNotice,
} from "@entities/notices";
import { NoticeDetailView } from "@views/notices";

type Params = { params: Promise<{ slug: string }> };

/**
 * Published, in-site (non-external) notices known at build time. Without params
 * the chrome cannot prerender (SiteHeader reads usePathname). cacheComponents
 * needs at least one result, so an empty set falls back to a sentinel that
 * 404s. A notice added later still renders on demand under NOTICE_TAG.
 */
export async function generateStaticParams() {
  const notices = await getPublishedNotices();
  const inSite = notices.filter((item) => !isExternalNotice(item));
  if (inSite.length === 0) return [{ slug: "none" }];
  return inSite.map((item) => ({ slug: item.ref }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNoticeByRef(slug);
  // Link-type notices 404 in the page, so they get the default title here too.
  return { title: item && !isExternalNotice(item) ? item.title : "News" };
}

export default async function NoticeDetailPage({ params }: Params) {
  const { slug } = await params;
  // getNoticeByRef only returns published items, so drafts 404 here.
  const item = await getNoticeByRef(slug);
  // Link-type notices have no in-site page — they are reached only through the
  // list's new-tab link to the external URL. A direct visit here is a 404.
  if (!item || isExternalNotice(item)) notFound();

  return (
    <PageShell>
      <NoticeDetailView item={item} />
    </PageShell>
  );
}
