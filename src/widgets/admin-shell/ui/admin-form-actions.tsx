import { Loader2 } from "lucide-react";
import { AdminButton, AdminLinkButton } from "./admin-button";

type AdminFormActionsProps = {
  /** Where the 취소 button goes back to. */
  cancelHref: string;
  submitLabel?: string;
  /** While true the submit button is disabled and shows a saving spinner, so a
   *  second click cannot fire a duplicate save. */
  pending?: boolean;
  /** Runs when 취소 is clicked (before navigating) — e.g. drop the draft. */
  onCancel?: () => void;
};

/** Bottom action row for admin forms: 취소 + 저장. */
export function AdminFormActions({
  cancelHref,
  submitLabel = "저장",
  pending = false,
  onCancel,
}: AdminFormActionsProps) {
  return (
    <div className="mt-10 flex items-center justify-end gap-2 border-t border-ink/10 pt-6">
      <AdminLinkButton href={cancelHref} variant="outline" onClick={onCancel}>
        취소
      </AdminLinkButton>
      <AdminButton type="submit" variant="solid" disabled={pending}>
        {pending ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            저장 중…
          </>
        ) : (
          submitLabel
        )}
      </AdminButton>
    </div>
  );
}
