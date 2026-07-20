"use client";

import { type FormEvent, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { showToast } from "@shared/ui/toast";
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
import type { Artist } from "@entities/artist";

type WorkRow = { year: string; title: string };

type ArtistFormProps = {
  initial?: Artist;
};

// NOTE(backend): slug/id are generated on the server, so they are not shown here.
export function ArtistForm({ initial }: ArtistFormProps) {
  const editing = Boolean(initial);
  const [works, setWorks] = useState<WorkRow[]>(initial?.works ?? []);

  // Prefill each fixed social field from the existing socials list.
  const socialHref = (label: string) =>
    initial?.socials?.find((s) => s.label === label)?.href ?? "";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): collect values (incl. works/socials) and save.
    showToast("저장되었습니다");
  };

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title={editing ? "아티스트 편집" : "새 아티스트"}
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
            requiredSize={UPLOAD_SIZE.portrait}
            className="w-60"
          />
        </AdminField>

        <AdminFormGrid>
          <AdminField label="이름 (한글)" htmlFor="nameKo" required>
            <AdminInput id="nameKo" name="nameKo" defaultValue={initial?.nameKo} />
          </AdminField>
          <AdminField label="이름 (영문)" htmlFor="nameEn">
            <AdminInput id="nameEn" name="nameEn" defaultValue={initial?.nameEn} />
          </AdminField>
        </AdminFormGrid>

        <AdminField label="역할" htmlFor="role" required className="max-w-sm">
          <AdminInput
            id="role"
            name="role"
            defaultValue={initial?.role}
            placeholder="예: 방송인, 배우, 크리에이터"
          />
        </AdminField>

        <AdminField label="설명" htmlFor="bio" hint="상세 페이지 인물소개 · 줄바꿈 그대로 반영">
          <AdminTextarea id="bio" name="bio" defaultValue={initial?.bio} />
        </AdminField>

        {/* Career — repeatable (year + title) */}
        <RepeatableSection
          label="활동 이력"
          addLabel="이력 추가"
          onAdd={() => setWorks((w) => [...w, { year: "", title: "" }])}
        >
          {works.map((work, i) => (
            <RepeatableRow
              key={i}
              onRemove={() => setWorks((w) => w.filter((_, j) => j !== i))}
            >
              <AdminInput
                placeholder="활동 연도"
                defaultValue={work.year}
                className="sm:w-32"
              />
              <AdminInput placeholder="제목" defaultValue={work.title} />
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
                defaultValue={socialHref("INSTAGRAM")}
                placeholder="https://instagram.com/..."
              />
            </AdminField>
            <AdminField label="유튜브 (선택)" htmlFor="youtube">
              <AdminInput
                id="youtube"
                name="youtube"
                defaultValue={socialHref("YOUTUBE")}
                placeholder="https://youtube.com/@..."
              />
            </AdminField>
            <AdminField label="메신저 (선택)" htmlFor="messenger">
              <AdminInput
                id="messenger"
                name="messenger"
                defaultValue={socialHref("KAKAO")}
                placeholder="카카오톡 채널 링크 등"
              />
            </AdminField>
          </div>
        </div>
      </div>

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
