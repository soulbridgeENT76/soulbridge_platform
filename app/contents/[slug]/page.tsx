import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CONTENTS, getContentBySlug } from "@entities/content";
import { ContentDetailView } from "@views/contents";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CONTENTS.map((content) => ({ slug: content.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = getContentBySlug(slug);
  return { title: content ? content.title : "Contents" };
}

export default async function ContentDetailPage({ params }: Params) {
  const { slug } = await params;
  const content = getContentBySlug(slug);
  if (!content) notFound();
  return <ContentDetailView content={content} />;
}
