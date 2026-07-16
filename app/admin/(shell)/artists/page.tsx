import { Plus } from "lucide-react";
import {
  AdminPageHeader,
  AdminLinkButton,
  DeleteButton,
} from "@widgets/admin-shell";
import { PageCopyEditor } from "@views/admin";
import { PAGE_COPY } from "@shared/config/page-copy";
import { ARTISTS } from "@entities/artist";

// TODO(backend): read from DB/API instead of the static ARTISTS array.
export default function AdminArtistsPage() {
  return (
    <div>
      <AdminPageHeader
        title="ARTISTS"
        description={`총 ${ARTISTS.length}명`}
        action={
          <AdminLinkButton href="/admin/artists/new" variant="solid">
            <Plus size={16} />새 아티스트
          </AdminLinkButton>
        }
      />

      <div className="mt-8">
        <PageCopyEditor
          initial={PAGE_COPY.artists}
          caption="아티스트 페이지 상단에 표시되는 제목·소제목입니다."
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-center text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/45">
            <tr>
              <th className="px-5 py-3.5 font-semibold">이름</th>
              <th className="px-5 py-3.5 font-semibold">역할</th>
              <th className="px-5 py-3.5 font-semibold">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/[0.06]">
            {ARTISTS.map((artist) => (
              <tr key={artist.slug} className="hover:bg-ink/[0.015]">
                <td className="px-5 py-4 font-medium text-ink">
                  {artist.nameKo}
                  <span className="ml-2 text-xs text-ink/40">
                    {artist.nameEn}
                  </span>
                </td>
                <td className="px-5 py-4 text-ink/60">{artist.role}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-center gap-1">
                    <AdminLinkButton
                      href={`/admin/artists/${artist.slug}`}
                      variant="ghost"
                    >
                      편집
                    </AdminLinkButton>
                    <DeleteButton itemName={artist.nameKo} />
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
