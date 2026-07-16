import { notFound } from "next/navigation";
import { getContentBySlug } from "@entities/content";
import { ContentForm } from "@views/admin";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = getContentBySlug(slug);
  if (!content) notFound();
  return <ContentForm initial={content} />;
}
