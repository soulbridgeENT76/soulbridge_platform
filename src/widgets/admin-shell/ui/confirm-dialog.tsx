"use client";

import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { AdminButton } from "./admin-button";

type ConfirmDialogProps = {
  open: boolean;
  /** Heading of the dialog. */
  title?: string;
  /** Body copy — usually a sentence naming the item being removed. */
  message: ReactNode;
  /** Label of the confirming button; also shown (with an ellipsis) while pending. */
  confirmLabel?: string;
  /** Disables the confirm button and shows a working label. */
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Shared destructive-action confirmation modal. Both the entity DeleteButton
 * and the category remover render this, so every irreversible action in the
 * admin asks the same way. Purely presentational — the caller owns the state
 * and the action.
 */
export function ConfirmDialog({
  open,
  title = "삭제하시겠어요?",
  message,
  confirmLabel = "삭제",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onCancel}
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
        <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <AdminButton variant="outline" onClick={onCancel}>
            취소
          </AdminButton>
          <AdminButton
            variant="solid"
            className="bg-red-600 hover:bg-red-500"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? `${confirmLabel} 중…` : confirmLabel}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
