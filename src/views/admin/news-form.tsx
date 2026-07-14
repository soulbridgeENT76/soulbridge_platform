"use client";

import type { FormEvent } from "react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminFormGrid,
  AdminFormActions,
  AdminPageHeader,
} from "@widgets/admin-shell";
import { NEWS_CATEGORIES, type NewsItem } from "@entities/news";

type NewsFormProps = {
  initial?: NewsItem;
};

// NOTE(backend): slug/id are generated on the server, so they are not shown here.
export function NewsForm({ initial }: NewsFormProps) {
  const editing = Boolean(initial);

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

        <AdminField label="본문" htmlFor="body" hint="줄바꿈 그대로 반영">
          <AdminTextarea
            id="body"
            name="body"
            defaultValue={initial?.body}
            className="min-h-64"
            placeholder="소식 본문을 작성하세요."
          />
        </AdminField>
      </div>

      <AdminFormActions cancelHref="/admin/news" />
    </form>
  );
}
