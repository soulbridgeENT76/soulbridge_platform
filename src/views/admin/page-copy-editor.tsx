"use client";

import type { FormEvent } from "react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminButton,
} from "@widgets/admin-shell";
import type { PageCopy } from "@shared/config/page-copy";

type PageCopyEditorProps = {
  initial: PageCopy;
  /** Card caption describing which page this copy belongs to. */
  caption?: string;
};

/**
 * Edits the public page heading (main title + subtitle) shown at the top of a
 * section page. TODO(backend): persist on save.
 */
export function PageCopyEditor({
  initial,
  caption = "페이지 상단에 표시되는 제목·소제목입니다.",
}: PageCopyEditorProps) {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): save the page copy.
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-ink/10 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">페이지 문구</p>
          <p className="mt-0.5 text-xs text-ink/50">{caption}</p>
        </div>
        <AdminButton type="submit" variant="solid">
          저장
        </AdminButton>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <AdminField label="메인 제목" htmlFor="pageTitle">
          <AdminInput
            id="pageTitle"
            name="pageTitle"
            defaultValue={initial.title}
          />
        </AdminField>

        <AdminField
          label="서브 제목"
          htmlFor="pageDescription"
          hint="줄바꿈 그대로 반영"
        >
          <AdminTextarea
            id="pageDescription"
            name="pageDescription"
            defaultValue={initial.description}
            className="min-h-24"
          />
        </AdminField>
      </div>
    </form>
  );
}
