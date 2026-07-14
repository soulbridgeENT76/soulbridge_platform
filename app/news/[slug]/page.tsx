import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NEWS, getNewsBySlug } from "@entities/news";
import { NewsDetailView } from "@views/news";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NEWS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  return { title: item ? item.title : "News" };
}

export default async function NewsDetailPage({ params }: Params) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();
  return <NewsDetailView item={item} />;
}
