import Image from "next/image";
import { Plus } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import {
  AdminPageHeader,
  AdminLinkButton,
  DeleteButton,
} from "@widgets/admin-shell";
import { SectionVisibilityToggle } from "@widgets/admin-shell/ui/section-visibility-toggle";
import { CategoryManager, PageCopyEditor } from "@views/admin";
import { PlaceholderImage } from "@shared/ui";
import {
  getContentsAdmin,
  getContentCategoriesAdmin,
  CONTENT_THUMB_RATIO,
} from "@entities/content";
import { getPageCopy } from "@entities/page-content";
import {
  removeContent,
  addCategory,
  renameCategory,
  removeCategory,
} from "@features/update-content";
import { PAGE_COPY } from "@shared/config/page-copy";

export default async function AdminContentsPage() {
  // Authed and uncached: the list is the operator's view of the truth, so it
  // must not lag a save by however long the public cache entry lives.
  const [contents, categories, copy] = await Promise.all([
    getContentsAdmin(),
    getContentCategoriesAdmin(),
    getPageCopy("contents"),
  ]);

  return (
    <div>

      <AdminPageHeader
        title="CONTENTS"
        description={`총 ${contents.length}개`}
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
        <PageCopyEditor
          slug="contents"
          initial={{
            title: copy?.title ?? PAGE_COPY.contents.title,
            description: copy?.description ?? PAGE_COPY.contents.description,
          }}
        />
        <CategoryManager
          categories={categories}
          onAdd={addCategory}
          onRename={renameCategory}
          onRemove={removeCategory}
        />
      </div>

      {contents.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-ink/10 bg-white px-5 py-10 text-center text-sm text-ink/45">
          등록된 콘텐츠가 없습니다.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-center text-sm">
            <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/45">
              <tr>
                {/* Left-aligned + padded to clear the thumbnail (px-5 20 +
                    w-16 64 + gap-4 16) so the header sits above the title. */}
                <th className="py-3.5 pl-25 pr-5 text-left font-semibold">
                  제목
                </th>
                <th className="px-5 py-3.5 font-semibold">카테고리</th>
                <th className="px-5 py-3.5 font-semibold">연도</th>
                <th className="px-5 py-3.5 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.06]">
              {contents.map((content) => (
                <tr key={content.id} className="hover:bg-ink/[0.015]">
                  <td className="px-5 py-4 text-left font-medium text-ink">
                    <div className="flex items-center gap-4">
                      {/* Image upload, or the YouTube video's thumbnail. */}
                      <span className="relative block h-9 w-16 shrink-0">
                        {content.preview ? (
                          <Image
                            src={content.preview}
                            alt=""
                            width={64}
                            height={36}
                            className="h-9 w-16 rounded object-cover"
                          />
                        ) : (
                          <PlaceholderImage
                            ratio={CONTENT_THUMB_RATIO}
                            size="sm"
                            className="w-16 rounded"
                          />
                        )}
                        {/* Play badge marks video content apart from an image. */}
                        {content.mediaType === "youtube" && (
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <FaYoutube
                              className="text-lg text-white/95 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
                              aria-hidden
                            />
                          </span>
                        )}
                      </span>
                      <span>{content.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink/60">{content.category}</td>
                  <td className="px-5 py-4 text-ink/60">{content.year}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center gap-1">
                      <AdminLinkButton
                        href={`/admin/contents/${content.ref}`}
                        variant="ghost"
                      >
                        편집
                      </AdminLinkButton>
                      {/* Bound on the server so the client button never holds
                          the id as tamperable data. */}
                      <DeleteButton
                        itemName={content.title}
                        action={removeContent.bind(null, content.id)}
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
