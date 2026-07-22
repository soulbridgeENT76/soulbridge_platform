import { notFound } from "next/navigation";
import { getNoticeByRefAdmin, getNoticeCategoriesAdmin } from "@entities/notices";
import { NoticeForm } from "@views/admin";

export default async function EditNoticePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, categories] = await Promise.all([
    getNoticeByRefAdmin(slug),
    getNoticeCategoriesAdmin(),
  ]);
  if (!item) notFound();
  return (
    <NoticeForm initial={item} categories={categories.map((c) => c.name)} />
  );
}
