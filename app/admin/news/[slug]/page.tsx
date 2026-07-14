import { notFound } from "next/navigation";
import { getNewsBySlug } from "@entities/news";
import { NewsForm } from "@views/admin";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();
  return <NewsForm initial={item} />;
}
