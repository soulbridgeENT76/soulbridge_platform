"use client";

import { useState, useTransition } from "react";
import { AlertTriangle } from "lucide-react";
import { showToast } from "@shared/ui/toast";
import { AdminButton } from "./admin-button";

type DeleteButtonProps = {
  /** Name of the item shown in the confirm dialog. */
  itemName: string;
  /**
   * Bound server action performing the delete. Optional: the lists that are
   * not wired to a backend yet still render the dialog, and confirming there
   * simply closes it.
   * TODO(backend): pass this from the contents and notice lists too.
   */
  action?: () => Promise<{ ok: boolean; error?: string }>;
};

/** Ghost "삭제" button that opens a confirmation modal. */
export function DeleteButton({ itemName, action }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onConfirm = () => {
    if (!action) {
      setOpen(false);
      return;
    }
    // The action revalidates the list path, so the row disappears on its own —
    // the dialog only has to report a failure the operator can act on.
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setOpen(false);
        showToast("삭제되었습니다");
      } else {
        showToast(result.error ?? "삭제에 실패했습니다.", "error");
      }
    });
  };

  return (
    <>
      <AdminButton
        variant="ghost"
        className="text-red-500/70 hover:bg-red-500/5 hover:text-red-600"
        onClick={() => setOpen(true)}
      >
        삭제
      </AdminButton>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-600">
              <AlertTriangle size={20} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-ink">삭제하시겠어요?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              <span className="font-medium text-ink">{itemName}</span> 항목을
              삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton variant="outline" onClick={() => setOpen(false)}>
                취소
              </AdminButton>
              <AdminButton
                variant="solid"
                className="bg-red-600 hover:bg-red-500"
                onClick={onConfirm}
                disabled={pending}
              >
                {pending ? "삭제 중…" : "삭제"}
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
