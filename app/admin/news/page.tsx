import { Plus } from "lucide-react";
import {
  AdminPageHeader,
  AdminLinkButton,
  DeleteButton,
} from "@widgets/admin-shell";
import { PageCopyEditor } from "@views/admin";
import { PAGE_COPY } from "@shared/config/page-copy";
import { NEWS, formatNewsDate } from "@entities/news";

// TODO(backend): read from DB/API instead of the static NEWS array.
export default function AdminNewsPage() {
  return (
    <div>
      <AdminPageHeader
        title="NEWS"
        description={`총 ${NEWS.length}개`}
        action={
          <AdminLinkButton href="/admin/news/new" variant="solid">
            <Plus size={16} />새 뉴스
          </AdminLinkButton>
        }
      />

      <div className="mt-8">
        <PageCopyEditor
          initial={PAGE_COPY.news}
          caption="뉴스 페이지 상단에 표시되는 제목·소제목입니다."
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/45">
            <tr>
              <th className="px-5 py-3.5 font-semibold">제목</th>
              <th className="px-5 py-3.5 font-semibold">분류</th>
              <th className="px-5 py-3.5 font-semibold">작성일</th>
              <th className="px-5 py-3.5 text-right font-semibold">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/[0.06]">
            {NEWS.map((item) => (
              <tr key={item.slug} className="hover:bg-ink/[0.015]">
                <td className="px-5 py-4 font-medium text-ink">{item.title}</td>
                <td className="px-5 py-4 text-ink/60">{item.category}</td>
                <td className="px-5 py-4 text-ink/60">
                  {formatNewsDate(item.date)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <AdminLinkButton
                      href={`/admin/news/${item.slug}`}
                      variant="ghost"
                    >
                      편집
                    </AdminLinkButton>
                    <DeleteButton itemName={item.title} />
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
