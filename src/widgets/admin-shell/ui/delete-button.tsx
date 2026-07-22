"use client";

import { useState, useTransition } from "react";
import { showToast } from "@shared/ui/toast";
import { AdminButton } from "./admin-button";
import { ConfirmDialog } from "./confirm-dialog";

type DeleteButtonProps = {
  /** Name of the item shown in the confirm dialog. */
  itemName: string;
  /** Bound server action performing the delete. */
  action: () => Promise<{ ok: boolean; error?: string }>;
};

/** Ghost "삭제" button that opens the shared confirmation modal. */
export function DeleteButton({ itemName, action }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onConfirm = () => {
    // The action revalidates the list path, so the row disappears on its own —
    // the dialog only has to report a failure the operator can act on.
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setOpen(false);
        showToast("삭제되었습니다", "delete");
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

      <ConfirmDialog
        open={open}
        message={
          <>
            <span className="font-medium text-ink">{itemName}</span> 항목을
            삭제합니다. 이 작업은 되돌릴 수 없습니다.
          </>
        }
        pending={pending}
        onConfirm={onConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
