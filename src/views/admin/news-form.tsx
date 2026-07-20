"use client";

import { type FormEvent, useState } from "react";
import { FileText, Link2 } from "lucide-react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminFormGrid,
  AdminFormActions,
  AdminPageHeader,
  AdminStatusToggle,
} from "@widgets/admin-shell";
import { cn } from "@shared/lib/cn";
import {
  NEWS_CATEGORIES,
  type NewsItem,
  type NewsLinkType,
} from "@entities/news";

type NewsFormProps = {
  initial?: NewsItem;
};

// NOTE(backend): slug/id are generated on the server, so they are not shown here.
export function NewsForm({ initial }: NewsFormProps) {
  const editing = Boolean(initial);
  const [linkType, setLinkType] = useState<NewsLinkType>(
    initial?.linkType ?? "article"
  );
  const external = linkType === "external";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): collect values and create/update the news record.
  };

  return (
    <form onSubmit={onSubmit}>
      <AdminPageHeader
        title={editing ? "뉴스 편집" : "새 뉴스"}
        description={editing ? initial?.title : "새 소식을 등록합니다."}
      />

      <div className="mt-8 flex flex-col gap-6">
        <AdminField label="제목" htmlFor="title" required>
          <AdminInput
            id="title"
            name="title"
            defaultValue={initial?.title}
            placeholder="소식 제목"
          />
        </AdminField>

        <AdminFormGrid>
          <AdminField label="분류" htmlFor="category" required>
            <AdminSelect
              id="category"
              name="category"
              defaultValue={initial?.category ?? NEWS_CATEGORIES[0]}
            >
              {NEWS_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </AdminSelect>
          </AdminField>

          <AdminField label="작성일" htmlFor="date" required>
            <AdminInput
              id="date"
              name="date"
              type="date"
              defaultValue={initial?.date}
            />
          </AdminField>
        </AdminFormGrid>

        {/* Publish switch — new items start inactive. */}
        <div className="rounded-xl border border-ink/10 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-ink">공개 상태</p>
              <p className="mt-0.5 text-xs text-ink/50">
                비활성이면 저장해도 사이트에 노출되지 않습니다. 새 글은 기본이
                비활성이에요.
              </p>
            </div>
            <AdminStatusToggle
              name="active"
              initial={initial?.active ?? false}
              itemName={initial?.title ?? "새 뉴스"}
            />
          </div>
        </div>

        {/* Display mode: in-site article OR jump straight to an external link. */}
        <AdminField
          label="표시 방식"
          hint="본문형은 사이트 안 상세 페이지로, 링크형은 클릭 시 외부 주소로 바로 이동합니다."
        >
          <div className="inline-flex rounded-lg border border-ink/15 p-1">
            <ModeTab
              active={!external}
              onClick={() => setLinkType("article")}
              icon={<FileText size={15} />}
              label="본문형"
            />
            <ModeTab
              active={external}
              onClick={() => setLinkType("external")}
              icon={<Link2 size={15} />}
              label="링크형"
            />
          </div>
          <input type="hidden" name="linkType" value={linkType} />
        </AdminField>

        {external ? (
          /* Link mode — the row jumps straight to this URL. */
          <AdminField
            label="외부 링크 URL"
            htmlFor="externalUrl"
            required
            hint="클릭 시 새 탭에서 이 주소로 바로 이동합니다."
          >
            <AdminInput
              id="externalUrl"
              name="externalUrl"
              type="url"
              defaultValue={initial?.externalUrl}
              placeholder="https://..."
            />
          </AdminField>
        ) : (
          /* Article mode — body plus an optional attached source link. */
          <>
            <AdminField label="본문" htmlFor="body" hint="줄바꿈 그대로 반영">
              <AdminTextarea
                id="body"
                name="body"
                defaultValue={initial?.body}
                className="min-h-64"
                placeholder="소식 본문을 작성하세요."
              />
            </AdminField>

            <AdminField
              label="첨부 링크 (선택)"
              htmlFor="externalUrl"
              hint="입력하면 상세 페이지에 '원문 보기' 버튼으로 표시됩니다."
            >
              <AdminInput
                id="externalUrl"
                name="externalUrl"
                type="url"
                defaultValue={initial?.externalUrl}
                placeholder="https://... (선택)"
              />
            </AdminField>
          </>
        )}
      </div>

      <AdminFormActions cancelHref="/admin/notice" />
    </form>
  );
}

function ModeTab({
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
