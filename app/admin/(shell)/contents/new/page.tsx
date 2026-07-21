import { ContentForm } from "@views/admin";
import { getContentCategoriesAdmin } from "@entities/content";

export default async function NewContentPage() {
  const categories = await getContentCategoriesAdmin();
  return <ContentForm categories={categories.map((c) => c.name)} />;
}
