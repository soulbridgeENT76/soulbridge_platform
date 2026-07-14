"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { AdminButton } from "./admin-button";

type DeleteButtonProps = {
  /** Name of the item shown in the confirm dialog. */
  itemName: string;
};

/**
 * Ghost "삭제" button that opens a confirmation modal.
 * TODO(backend): call the delete action in `onConfirm`.
 */
export function DeleteButton({ itemName }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);

  const onConfirm = () => {
    // TODO(backend): perform the delete here, then refresh the list.
    setOpen(false);
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
              >
                삭제
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
