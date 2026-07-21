import { notFound } from "next/navigation";
import {
  getContentByRefAdmin,
  getContentCategoriesAdmin,
} from "@entities/content";
import { ContentForm } from "@views/admin";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Authed, uncached — an edit form must show what is actually stored.
  const [content, categories] = await Promise.all([
    getContentByRefAdmin(slug),
    getContentCategoriesAdmin(),
  ]);
  if (!content) notFound();
  return (
    <ContentForm initial={content} categories={categories.map((c) => c.name)} />
  );
}
