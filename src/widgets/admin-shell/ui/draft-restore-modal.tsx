"use client";

import { History } from "lucide-react";
import { AdminButton } from "./admin-button";

type DraftRestoreModalProps = {
  open: boolean;
  /** Keep editing the recovered draft. */
  onContinue: () => void;
  /** Discard the draft and start from a blank/original form. */
  onDiscard: () => void;
};

/**
 * Shown when an admin form recovers a session draft (the operator navigated
 * away and came back). Forces a choice — continue the draft, or start fresh —
 * so recovered content is never a surprise. No backdrop dismiss on purpose.
 */
export function DraftRestoreModal({
  open,
  onContinue,
  onDiscard,
}: DraftRestoreModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
          <History size={20} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-ink">
          작성 중이던 내용이 있어요
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          이전에 작성하던 내용을 불러왔습니다. 이어서 작성하거나 새로 시작할 수
          있어요. (이미지는 다시 선택해 주세요.)
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton type="button" variant="outline" onClick={onDiscard}>
            새로 작성
          </AdminButton>
          <AdminButton type="button" variant="solid" onClick={onContinue}>
            이어서 작성
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
