import { Plus } from "lucide-react";
import {
  AdminPageHeader,
  AdminLinkButton,
  DeleteButton,
} from "@widgets/admin-shell";
import { SectionVisibilityToggle } from "@widgets/admin-shell/ui/section-visibility-toggle";
import { CategoryManager, PageCopyEditor } from "@views/admin";
import { CONTENTS, CONTENT_CATEGORIES } from "@entities/content";
import { PAGE_COPY } from "@shared/config/page-copy";

// TODO(backend): read from DB/API instead of the static CONTENTS array.
// Keep the row shape (title/category/year) and the UI stays unchanged.
export default function AdminContentsPage() {
  return (
    <div>
      <AdminPageHeader
        title="CONTENTS"
        description={`총 ${CONTENTS.length}개`}
        action={
          <AdminLinkButton href="/admin/contents/new" variant="solid">
            <Plus size={16} />새 콘텐츠
          </AdminLinkButton>
        }
      />

      <div className="mt-8">
        <SectionVisibilityToggle href="/contents" />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <PageCopyEditor initial={PAGE_COPY.contents} />
        <CategoryManager initial={CONTENT_CATEGORIES} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-center text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/45">
            <tr>
              <th className="px-5 py-3.5 font-semibold">제목</th>
              <th className="px-5 py-3.5 font-semibold">카테고리</th>
              <th className="px-5 py-3.5 font-semibold">연도</th>
              <th className="px-5 py-3.5 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/[0.06]">
            {CONTENTS.map((content) => (
              <tr key={content.slug} className="hover:bg-ink/[0.015]">
                <td className="px-5 py-4 font-medium text-ink">
                  {content.title}
                </td>
                <td className="px-5 py-4 text-ink/60">{content.category}</td>
                <td className="px-5 py-4 text-ink/60">{content.year}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-center gap-1">
                    <AdminLinkButton
                      href={`/admin/contents/${content.slug}`}
                      variant="ghost"
                    >
                      편집
                    </AdminLinkButton>
                    <DeleteButton itemName={content.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
