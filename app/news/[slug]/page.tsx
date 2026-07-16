import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PUBLISHED_NEWS, getNewsBySlug } from "@entities/news";
import { NewsDetailView } from "@views/news";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PUBLISHED_NEWS.map((item) => ({ slug: item.slug }));
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
  return <NewsDetailView item={item} />;
}
