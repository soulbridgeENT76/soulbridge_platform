import { Plus } from "lucide-react";
import {
  AdminPageHeader,
  AdminLinkButton,
} from "@widgets/admin-shell";
import { SectionVisibilityToggle } from "@widgets/admin-shell/ui/section-visibility-toggle";
import { PageCopyEditor, ArtistTable } from "@views/admin";
import { PAGE_COPY } from "@shared/config/page-copy";
import { getArtistsAdmin } from "@entities/artist";
import { getPageCopy } from "@entities/page-content";

export default async function AdminArtistsPage() {
  // Authed and uncached: the list is the operator's view of the truth, so it
  // must not lag a save by however long the public cache entry lives.
  const [artists, copy] = await Promise.all([
    getArtistsAdmin(),
    getPageCopy("artists"),
  ]);

  return (
    <div>

      <AdminPageHeader
        title="ARTISTS"
        description={`총 ${artists.length}명`}
        action={
          <AdminLinkButton href="/admin/artists/new" variant="solid">
            <Plus size={16} />새 아티스트
          </AdminLinkButton>
        }
      />

      <div className="mt-8">
        <SectionVisibilityToggle href="/artists" />
      </div>

      <div className="mt-6">
        <PageCopyEditor
          slug="artists"
          initial={{
            title: copy?.title ?? PAGE_COPY.artists.title,
            description: copy?.description ?? PAGE_COPY.artists.description,
          }}
          caption="아티스트 페이지 상단에 표시되는 제목·소제목입니다."
        />
      </div>

      {artists.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-ink/10 bg-white px-5 py-10 text-center text-sm text-ink/45">
          등록된 아티스트가 없습니다.
        </p>
      ) : (
        <ArtistTable artists={artists} />
      )}
    </div>
  );
}
