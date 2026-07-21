import { Suspense } from "react";
import { Plus } from "lucide-react";
import {
  AdminPageHeader,
  AdminLinkButton,
} from "@widgets/admin-shell";
import { SectionVisibilityToggle } from "@widgets/admin-shell/ui/section-visibility-toggle";
import { PageCopyEditor, ArtistTable } from "@views/admin";
// Imported by path, not from the @shared/ui barrel: that barrel is pulled into
// server components and deliberately keeps client-only toast modules out.
import { RedirectToast } from "@shared/ui/redirect-toast";
import { PAGE_COPY } from "@shared/config/page-copy";
import { getArtistsAdmin } from "@entities/artist";

export default async function AdminArtistsPage() {
  // Authed and uncached: the list is the operator's view of the truth, so it
  // must not lag a save by however long the public cache entry lives.
  const artists = await getArtistsAdmin();

  return (
    <div>
      {/* Confirms a save that redirected here from the form. useSearchParams
          needs a Suspense boundary under cacheComponents. */}
      <Suspense>
        <RedirectToast param="saved" />
      </Suspense>

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
          initial={PAGE_COPY.artists}
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
