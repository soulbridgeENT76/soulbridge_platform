"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, TriangleAlert } from "lucide-react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminFormGrid,
  AdminImageUpload,
  AdminFormActions,
  AdminPageHeader,
  AdminButton,
} from "@widgets/admin-shell";
import { PORTRAIT_RATIO, UPLOAD_SIZE } from "@shared/config/media";
import { WEBP_QUALITY_PHOTO } from "@shared/lib/image-to-webp";
import { useFieldErrors, fieldValue } from "@shared/lib/use-field-errors";
import type { SocialKey } from "@shared/config/socials";
import type { Artist, ArtistWork } from "@entities/artist";
import { saveArtist } from "@features/update-artist";

type ArtistFormProps = {
  initial?: Artist;
};

// The slug is derived from the English name on the server, so it is not shown
// here — one less field to keep consistent, and it stays stable across renames.
export function ArtistForm({ initial }: ArtistFormProps) {
  const editing = Boolean(initial);
  const [works, setWorks] = useState<ArtistWork[]>(initial?.works ?? []);
  const [state, formAction] = useActionState(saveArtist, { ok: true });

  // Prefill each fixed social field from the existing socials list. Keyed by
  // SocialKey, the same registry the public icons resolve through, so a field
  // here and the icon it produces can never disagree.
  const socialHref = (key: SocialKey) =>
    initial?.socials.find((s) => s.key === key)?.href ?? "";

  const { errors, clearError, guardAction } = useFieldErrors();

  // Fields top-to-bottom, so the first invalid one is the one that takes focus.
  const validate = (formData: FormData): Record<string, string> => {
    const errs: Record<string, string> = {};

    if (!fieldValue(formData, "nameKo")) {
      errs.nameKo = "이름(한글)을 입력해주세요.";
    }

    const nameEn = fieldValue(formData, "nameEn");
    if (!nameEn) errs.nameEn = "이름(영문)을 입력해주세요.";
    else if (!/^[A-Za-z _-]+$/.test(nameEn)) {
      errs.nameEn = "이름(영문)은 영문, 공백, -, _ 만 사용할 수 있습니다.";
    }

    if (!fieldValue(formData, "role")) errs.role = "역할을 입력해주세요.";

    return errs;
  };

  const clientAction = guardAction(
    validate,
    ["nameKo", "nameEn", "role"],
    formAction
  );

  return (
    <form action={clientAction}>
      {/* Empty on create — the action reads this to tell insert from update. */}
      <input type="hidden" name="id" value={initial?.id ?? ""} />
      {/* The career list is variable-length, so it travels as one JSON field
          rather than as indexed input names. */}
      <input type="hidden" name="works" value={JSON.stringify(works)} />
      <AdminPageHeader
        title={editing ? "EDIT ARTIST" : "NEW ARTIST"}
        description={editing ? initial?.nameKo : "새 아티스트를 등록합니다."}
      />

      <div className="mt-8 flex flex-col gap-6">
        <AdminField
          label="프로필 이미지"
          hint="세로형 3:4"
        >
          <AdminImageUpload
            ratio={PORTRAIT_RATIO}
            name="profile"
            initialUrl={initial?.photo}
            requiredSize={UPLOAD_SIZE.portrait}
            output={{ ...UPLOAD_SIZE.portrait, fit: "cover" }}
            outputQuality={WEBP_QUALITY_PHOTO}
            className="w-60"
          />
        </AdminField>

        <AdminFormGrid>
          <AdminField
            label="이름 (한글)"
            htmlFor="nameKo"
            required
            error={errors.nameKo}
          >
            <AdminInput
              id="nameKo"
              name="nameKo"
              defaultValue={initial?.nameKo}
              aria-invalid={errors.nameKo ? true : undefined}
              onChange={() => clearError("nameKo")}
            />
          </AdminField>
          <AdminField
            label="이름 (영문)"
            htmlFor="nameEn"
            required
            hint="영문, 공백, -, _ 만 사용 가능합니다."
            error={errors.nameEn}
          >
            {/* No native `required`/`pattern`: validation is handled in
                clientAction so the message shows inline, not as a tooltip. */}
            <AdminInput
              id="nameEn"
              name="nameEn"
              defaultValue={initial?.nameEn}
              aria-invalid={errors.nameEn ? true : undefined}
              onChange={() => clearError("nameEn")}
            />
          </AdminField>
        </AdminFormGrid>

        <AdminField
          label="역할"
          htmlFor="role"
          required
          error={errors.role}
          className="max-w-sm"
        >
          <AdminInput
            id="role"
            name="role"
            defaultValue={initial?.role}
            placeholder="예: 방송인, 배우, 크리에이터"
            aria-invalid={errors.role ? true : undefined}
            onChange={() => clearError("role")}
          />
        </AdminField>

        <AdminField label="설명" htmlFor="bio" hint="상세 페이지 인물소개 · 줄바꿈 그대로 반영">
          <AdminTextarea id="bio" name="bio" defaultValue={initial?.bio} />
        </AdminField>

        {/* Career — repeatable. Controlled, because the rows are serialized to
            the hidden `works` field on submit: uncontrolled inputs would keep
            their text in the DOM where the JSON never sees it. */}
        <RepeatableSection
          label="활동 이력"
          addLabel="이력 추가"
          onAdd={() => setWorks((w) => [...w, { label: "", description: "" }])}
        >
          {works.map((work, i) => (
            <RepeatableRow
              key={i}
              onRemove={() => setWorks((w) => w.filter((_, j) => j !== i))}
            >
              <AdminInput
                placeholder="활동 연도"
                value={work.label}
                onChange={(e) =>
                  setWorks((w) =>
                    w.map((x, j) =>
                      j === i ? { ...x, label: e.target.value } : x
                    )
                  )
                }
                className="sm:w-32"
              />
              <AdminInput
                placeholder="제목"
                value={work.description}
                onChange={(e) =>
                  setWorks((w) =>
                    w.map((x, j) =>
                      j === i ? { ...x, description: e.target.value } : x
                    )
                  )
                }
              />
            </RepeatableRow>
          ))}
        </RepeatableSection>

        {/* Socials — fixed optional fields */}
        <div className="rounded-xl border border-ink/10 p-5">
          <span className="text-sm font-semibold text-ink">SNS</span>
          <p className="mt-0.5 text-xs text-ink/50">
            선택 입력 · 비우면 표시되지 않습니다.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <AdminField label="인스타그램 (선택)" htmlFor="instagram">
              <AdminInput
                id="instagram"
                name="instagram"
                defaultValue={socialHref("instagram")}
                placeholder="https://instagram.com/..."
              />
            </AdminField>
            <AdminField label="유튜브 (선택)" htmlFor="youtube">
              <AdminInput
                id="youtube"
                name="youtube"
                defaultValue={socialHref("youtube")}
                placeholder="https://youtube.com/@..."
              />
            </AdminField>
            <AdminField label="메신저 (선택)" htmlFor="messenger">
              <AdminInput
                id="messenger"
                name="messenger"
                defaultValue={socialHref("messenger")}
                placeholder="카카오톡 채널 링크 등"
              />
            </AdminField>
          </div>
        </div>
      </div>

      {/* Uploads and saves fail for reasons the operator can act on (file too
          large, network dropped), so the action reports them instead of
          throwing. Success redirects, so nothing else needs announcing. */}
      {state.error && (
        <p className="mt-5 flex items-start gap-1.5 text-sm text-red-600">
          <TriangleAlert size={15} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <AdminFormActions cancelHref="/admin/artists" />
    </form>
  );
}

function RepeatableSection({
  label,
  addLabel,
  onAdd,
  children,
}: {
  label: string;
  addLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink/10 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{label}</span>
        <AdminButton type="button" variant="outline" onClick={onAdd}>
          <Plus size={15} />
          {addLabel}
        </AdminButton>
      </div>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function RepeatableRow({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      {children}
      <button
        type="button"
        onClick={onRemove}
        aria-label="삭제"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red-500/5 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
