"use client";

import { useActionState, useState } from "react";
import NextImage from "next/image";
import { Image as ImageIcon, TriangleAlert, Video } from "lucide-react";
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
import { useFieldErrors, fieldValue } from "@shared/lib/use-field-errors";
import { WEBP_QUALITY_PHOTO } from "@shared/lib/image-to-webp";
import { parseYoutubeId, youtubeThumbnail } from "@shared/lib/youtube";
import { LANDSCAPE_RATIO, UPLOAD_SIZE, formatSize } from "@shared/config/media";
// Type from the model, not the entity barrel: this is a client component and
// the barrel also exports the server-only readers.
import type { Content } from "@entities/content/model/types";
import { saveContent } from "@features/update-content";

type ContentFormProps = {
  /** Present in edit mode; absent when creating. */
  initial?: Content;
  /** Category options, resolved from the DB by the server parent. */
  categories: string[];
};

type MediaType = "image" | "video";

/** URL-safe: English letters, digits, hyphen, underscore. */
const SLUG_PATTERN = /^[A-Za-z0-9_-]+$/;

// The slug is derived from the title on the server, so it is not shown here.
export function ContentForm({ initial, categories }: ContentFormProps) {
  const editing = Boolean(initial);

  // Image OR video — mutually exclusive. The hidden `mediaType` field tells the
  // action which branch to persist.
  const [mediaType, setMediaType] = useState<MediaType>(
    initial?.mediaType === "youtube" ? "video" : "image"
  );

  // Controlled so the thumbnail preview updates as the URL is typed. Editing a
  // YouTube content prefills the stored id, which parses back to itself.
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtubeId ?? "");
  const previewId = parseYoutubeId(youtubeUrl);

  const [state, formAction] = useActionState(saveContent, { ok: true });
  const { errors, clearError, guardSubmit } = useFieldErrors();

  const validate = (formData: FormData): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!fieldValue(formData, "category")) {
      errs.category = "카테고리를 선택해주세요.";
    }
    if (!fieldValue(formData, "title")) errs.title = "제목을 입력해주세요.";
    // Slug is optional; a filled one must be URL-safe.
    const slug = fieldValue(formData, "slug");
    if (slug && !SLUG_PATTERN.test(slug)) {
      errs.slug = "영문, 숫자, -, _ 만 사용할 수 있습니다.";
    }
    // Video mode: a provided link must be a YouTube URL. Empty is allowed.
    if (mediaType === "video") {
      const url = fieldValue(formData, "youtubeUrl");
      if (url && !parseYoutubeId(url)) {
        errs.youtubeUrl = "유튜브 URL 만 입력할 수 있습니다.";
      }
    }
    return errs;
  };

  const clientSubmit = guardSubmit(
    validate,
    ["category", "title", "slug", "youtubeUrl"],
    formAction
  );

  return (
    <form onSubmit={clientSubmit}>
      {/* Empty on create — the action reads this to tell insert from update. */}
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      <input type="hidden" name="mediaType" value={mediaType} />

      <AdminPageHeader
        title={editing ? "EDIT CONTENT" : "NEW CONTENT"}
        description={editing ? initial?.title : "새 콘텐츠를 등록합니다."}
      />

      <div className="mt-8 flex flex-col gap-6">
        {/* Category — options are managed on the contents list screen. */}
        <AdminField
          label="카테고리"
          htmlFor="category"
          required
          error={errors.category}
          className="max-w-sm"
        >
          <AdminSelect
            id="category"
            name="category"
            defaultValue={initial?.category ?? categories[0] ?? ""}
            aria-invalid={errors.category ? true : undefined}
            onChange={() => clearError("category")}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </AdminSelect>
        </AdminField>

        {/* Main title */}
        <AdminField label="제목" htmlFor="title" required error={errors.title}>
          <AdminInput
            id="title"
            name="title"
            defaultValue={initial?.title}
            placeholder="콘텐츠 메인 제목"
            aria-invalid={errors.title ? true : undefined}
            onChange={() => clearError("title")}
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

        {/* Optional custom URL — blank routes by id. */}
        <AdminField
          label="URL 주소 (선택)"
          htmlFor="slug"
          hint="영문, 숫자, -, _ 만 사용 가능합니다. 비우면 ID 주소로 접근합니다."
          error={errors.slug}
          className="max-w-md"
        >
          <AdminInput
            id="slug"
            name="slug"
            defaultValue={initial?.slug ?? ""}
            placeholder="예: bridge-people-s1"
            aria-invalid={errors.slug ? true : undefined}
            onChange={() => clearError("slug")}
          />
        </AdminField>

        {/* Media: image OR video (mutually exclusive) */}
        <AdminField
          label="대표 미디어"
          error={mediaType === "video" ? errors.youtubeUrl : undefined}
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
                  initialUrl={initial?.mediaType === "image" ? initial.thumbnail : null}
                  recommendedSize={UPLOAD_SIZE.landscape}
                  output={{ ...UPLOAD_SIZE.landscape, fit: "cover" }}
                  outputQuality={WEBP_QUALITY_PHOTO}
                />
                <p className="mt-2 text-xs text-ink/45">
                  가로형 16:9로 자동 조정됩니다. 어떤 크기든 업로드할 수 있으며,
                  권장 해상도는 {formatSize(UPLOAD_SIZE.landscape)}입니다.
                </p>
              </div>
            ) : (
              <div>
                <AdminInput
                  id="youtubeUrl"
                  name="youtubeUrl"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    clearError("youtubeUrl");
                  }}
                  aria-invalid={errors.youtubeUrl ? true : undefined}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="mt-2 text-xs text-ink/45">
                  유튜브 URL 만 입력할 수 있습니다.
                </p>

                {/* Live thumbnail preview once a valid id is parsed. */}
                {previewId && (
                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-medium text-ink/55">
                      썸네일 미리보기
                    </p>
                    <NextImage
                      src={youtubeThumbnail(previewId)}
                      alt=""
                      width={320}
                      height={180}
                      unoptimized
                      className="w-64 rounded-lg border border-ink/10"
                      style={{ aspectRatio: LANDSCAPE_RATIO }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </AdminField>

        {/* Body */}
        <AdminField label="본문 내용" htmlFor="body" hint="상세 페이지 본문 · 줄바꿈 그대로 반영">
          <AdminTextarea
            id="body"
            name="body"
            defaultValue={initial?.synopsis}
            className="min-h-48"
            placeholder="작품 소개, 크레딧 등을 자유롭게 작성"
          />
        </AdminField>

        {/* Related link */}
        <AdminField
          label="관련 링크 (선택)"
          htmlFor="referenceUrl"
          hint="입력하면 상세 페이지에 '관련 링크' 버튼으로 표시됩니다."
        >
          <AdminInput
            id="referenceUrl"
            name="referenceUrl"
            type="url"
            defaultValue={initial?.referenceUrl}
            placeholder="https://... (선택)"
          />
        </AdminField>
      </div>

      {/* Uploads and saves fail for reasons the operator can act on, so the
          action reports them here. Success redirects to the list. */}
      {state.error && (
        <p className="mt-5 flex items-start gap-1.5 text-sm text-red-600">
          <TriangleAlert size={15} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

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
