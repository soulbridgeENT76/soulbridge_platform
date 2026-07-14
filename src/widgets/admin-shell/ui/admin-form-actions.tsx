import { AdminButton, AdminLinkButton } from "./admin-button";

type AdminFormActionsProps = {
  /** Where the 취소 button goes back to. */
  cancelHref: string;
  submitLabel?: string;
};

/** Bottom action row for admin forms: 취소 + 저장. */
export function AdminFormActions({
  cancelHref,
  submitLabel = "저장",
}: AdminFormActionsProps) {
  return (
    <div className="mt-10 flex items-center justify-end gap-2 border-t border-ink/10 pt-6">
      <AdminLinkButton href={cancelHref} variant="outline">
        취소
      </AdminLinkButton>
      <AdminButton type="submit" variant="solid">
        {submitLabel}
      </AdminButton>
    </div>
  );
}
