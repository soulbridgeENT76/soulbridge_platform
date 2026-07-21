import { Suspense } from "react";
import { Plus } from "lucide-react";
import {
  AdminPageHeader,
  AdminLinkButton,
  DeleteButton,
  AdminStatusToggle,
} from "@widgets/admin-shell";
import { SectionVisibilityToggle } from "@widgets/admin-shell/ui/section-visibility-toggle";
import { CategoryManager, PageCopyEditor } from "@views/admin";
import { RedirectToast } from "@shared/ui/redirect-toast";
import { PAGE_COPY } from "@shared/config/page-copy";
import {
  getNoticesAdmin,
  getNoticeCategoriesAdmin,
  formatNoticeDate,
} from "@entities/notices";
import {
  removeNotice,
  toggleNoticeActive,
  addCategory,
  renameCategory,
  removeCategory,
} from "@features/update-notices";

export default async function AdminNoticePage() {
  // Authed and uncached: the list is the operator's view of the truth (drafts
  // and scheduled items included).
  const [notices, categories] = await Promise.all([
    getNoticesAdmin(),
    getNoticeCategoriesAdmin(),
  ]);

  return (
    <div>
      {/* Confirms a save that redirected here from the form. */}
      <Suspense>
        <RedirectToast param="saved" />
      </Suspense>

      <AdminPageHeader
        title="NOTICES"
        description={`총 ${notices.length}개`}
        action={
          <AdminLinkButton href="/admin/notices/new" variant="solid">
            <Plus size={16} />새 소식
          </AdminLinkButton>
        }
      />

      <div className="mt-8">
        <SectionVisibilityToggle href="/notice" />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <PageCopyEditor
          initial={PAGE_COPY.news}
          caption="공지 페이지 상단에 표시되는 제목·소제목입니다."
        />
        <CategoryManager
          categories={categories}
          onAdd={addCategory}
          onRename={renameCategory}
          onRemove={removeCategory}
        />
      </div>

      {notices.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-ink/10 bg-white px-5 py-10 text-center text-sm text-ink/45">
          등록된 소식이 없습니다.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-center text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/45">
              <tr>
                <th className="px-5 py-3.5 font-semibold">상태</th>
                <th className="px-5 py-3.5 text-left font-semibold">제목</th>
                <th className="px-5 py-3.5 font-semibold">분류</th>
                <th className="px-5 py-3.5 font-semibold">게시일</th>
                <th className="px-5 py-3.5 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.06]">
              {notices.map((item) => (
                <tr key={item.id} className="hover:bg-ink/[0.015]">
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      {/* Persists on toggle; bound on the server so the client
                          never holds the id as tamperable data. */}
                      <AdminStatusToggle
                        initial={item.active === true}
                        itemName={item.title}
                        action={toggleNoticeActive.bind(null, item.id)}
                      />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-left font-medium text-ink">
                    {item.title}
                  </td>
                  <td className="px-5 py-4 text-ink/60">{item.category}</td>
                  <td className="px-5 py-4 text-ink/60">
                    {formatNoticeDate(item.date)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-1">
                      <AdminLinkButton
                        href={`/admin/notices/${item.ref}`}
                        variant="ghost"
                      >
                        편집
                      </AdminLinkButton>
                      <DeleteButton
                        itemName={item.title}
                        action={removeNotice.bind(null, item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
