"use client";

import { type FormEvent, useState } from "react";
import { Image as ImageIcon, Video } from "lucide-react";
import { showToast } from "@shared/ui/toast";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminImageUpload,
  AdminFormActions,
  AdminPageHeader,
} from "@widgets/admin-shell";
import { cn } from "@shared/lib/cn";
import { LANDSCAPE_RATIO, UPLOAD_SIZE } from "@shared/config/media";
import { CONTENT_CATEGORIES, type Content } from "@entities/content";

type ContentFormProps = {
  /** Present in edit mode; absent when creating. */
  initial?: Content;
};

type MediaType = "image" | "video";

// NOTE(backend): slug/id are generated on the server, so they are not shown here.
// Categories are managed on the contents list screen, not in this form.
export function ContentForm({ initial }: ContentFormProps) {
  const editing = Boolean(initial);

  // Image OR video — mutually exclusive.
  const [mediaType, setMediaType] = useState<MediaType>(
    initial?.youtubeId ? "video" : "image"
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): collect values and create/update the content record.
    showToast("저장되었습니다");
  };

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title={editing ? "콘텐츠 편집" : "새 콘텐츠"}
        description={editing ? initial?.title : "새 콘텐츠를 등록합니다."}
      />

      <div className="mt-8 flex flex-col gap-6">
        {/* Category — options are managed on the contents list screen. */}
        <AdminField label="카테고리" htmlFor="category" required className="max-w-sm">
          <AdminSelect
            id="category"
            name="category"
            defaultValue={initial?.category ?? CONTENT_CATEGORIES[0]}
          >
            {CONTENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </AdminSelect>
        </AdminField>

        {/* Main title */}
        <AdminField label="제목" htmlFor="title" required>
          <AdminInput
            id="title"
            name="title"
            defaultValue={initial?.title}
            placeholder="콘텐츠 메인 제목"
          />
        </AdminField>

        {/* Subtitle */}
        <AdminField label="서브 제목" htmlFor="subtitle" hint="제목 아래 보조 문구">
          <AdminInput
            id="subtitle"
            name="subtitle"
            defaultValue={initial?.note}
            placeholder="예: 교양 시리즈 · 로크미디어 제휴"
          />
        </AdminField>

        {/* Air / production date */}
        <AdminField
          label="방영·제작일자"
          htmlFor="airDate"
          hint='예: "2027", "2026 — ONGOING", "2026.05"'
          className="max-w-sm"
        >
          <AdminInput id="airDate" name="airDate" defaultValue={initial?.year} />
        </AdminField>

        {/* Media: image OR video (mutually exclusive) */}
        <AdminField
          label="대표 미디어"
          hint="이미지 또는 유튜브 URL 중 하나만 등록할 수 있습니다."
        >
          <div className="inline-flex rounded-lg border border-ink/15 p-1">
            <MediaTab
              active={mediaType === "image"}
              onClick={() => setMediaType("image")}
              icon={<ImageIcon size={15} />}
              label="이미지"
            />
            <MediaTab
              active={mediaType === "video"}
              onClick={() => setMediaType("video")}
              icon={<Video size={15} />}
              label="유튜브 URL"
            />
          </div>

          <div className="mt-4">
            {mediaType === "image" ? (
              <div>
                <AdminImageUpload
                  ratio={LANDSCAPE_RATIO}
                  name="image"
                  requiredSize={UPLOAD_SIZE.landscape}
                />
                <p className="mt-2 text-xs text-ink/45">가로형 16:9</p>
              </div>
            ) : (
              <AdminInput
                name="youtubeUrl"
                defaultValue={initial?.youtubeId}
                placeholder="https://youtube.com/watch?v=..."
              />
            )}
          </div>
        </AdminField>

        {/* Body */}
        <AdminField label="본문 내용" htmlFor="body" hint="상세 페이지 본문 · 줄바꿈 그대로 반영">
          <AdminTextarea
            id="body"
            name="body"
            defaultValue={initial?.synopsis ?? initial?.description}
            className="min-h-48"
            placeholder="작품 소개, 크레딧 등을 자유롭게 작성"
          />
        </AdminField>
      </div>

      <AdminFormActions cancelHref="/admin/contents" />
    </form>
  );
}

function MediaTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors",
        active ? "bg-brand text-paper" : "text-ink/55 hover:text-ink"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
