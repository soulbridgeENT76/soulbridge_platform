"use client";

import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminButton,
} from "@widgets/admin-shell";
import { useSaveAction } from "@shared/ui/use-save-action";
import { submitAction } from "@shared/lib/use-field-errors";
import { savePageCopy } from "@features/update-page-copy";

type PageCopyEditorProps = {
  /** page_contents row this copy belongs to ("contents", "artists", "notice"…). */
  slug: string;
  initial: { title: string; description: string };
  /** Card caption describing which page this copy belongs to. */
  caption?: string;
};

/**
 * Edits the public page heading (main title + subtitle) shown at the top of a
 * section page, persisting to page_contents via savePageCopy. The eyebrow is
 * not edited here — it mirrors the home banner's CTA label (single source), so
 * the action leaves the stored subtitle untouched when the field is absent.
 */
export function PageCopyEditor({
  slug,
  initial,
  caption = "페이지 상단에 표시되는 제목·소제목입니다.",
}: PageCopyEditorProps) {
  const { state, pending, run } = useSaveAction(savePageCopy, { ok: false }, {
    tone: "edit",
  });

  return (
    <form onSubmit={submitAction(run)} className="rounded-2xl border border-ink/10 bg-white p-5">
      <input type="hidden" name="slug" value={slug} />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">페이지 문구</p>
          <p className="mt-0.5 text-xs text-ink/50">{caption}</p>
        </div>
        <AdminButton type="submit" variant="solid" disabled={pending}>
          저장
        </AdminButton>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <AdminField label="메인 제목" htmlFor={`pageTitle-${slug}`}>
          <AdminInput
            id={`pageTitle-${slug}`}
            name="title"
            defaultValue={initial.title}
          />
        </AdminField>

        <AdminField
          label="서브 제목"
          htmlFor={`pageDescription-${slug}`}
          hint="줄바꿈 그대로 반영"
        >
          <AdminTextarea
            id={`pageDescription-${slug}`}
            name="description"
            defaultValue={initial.description}
            className="min-h-24"
          />
        </AdminField>
      </div>

      {state.error && (
        <p className="mt-4 text-sm font-medium text-red-500">{state.error}</p>
      )}
    </form>
  );
}
