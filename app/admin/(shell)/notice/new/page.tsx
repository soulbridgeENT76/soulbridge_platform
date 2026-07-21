import { NoticeForm } from "@views/admin";
import { getNoticeCategoriesAdmin } from "@entities/notices";

export default async function NewNoticePage() {
  const categories = await getNoticeCategoriesAdmin();
  return <NoticeForm categories={categories.map((c) => c.name)} />;
}
