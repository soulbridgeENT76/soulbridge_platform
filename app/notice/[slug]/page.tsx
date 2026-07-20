import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  PUBLISHED_NEWS,
  getNewsBySlug,
  isExternalNews,
} from "@entities/news";
import { NewsDetailView } from "@views/news";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // External items have no in-site detail page, so skip them here.
  return PUBLISHED_NEWS.filter((item) => !isExternalNews(item)).map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  return { title: item?.active ? item.title : "News" };
}

export default async function NewsDetailPage({ params }: Params) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  // Inactive items are unpublished, so they must not be reachable by URL.
  if (!item || !item.active) notFound();
  // External items are link-only — send anyone who lands here to the source.
  if (isExternalNews(item)) redirect(item.externalUrl!);
  return <NewsDetailView item={item} />;
}
