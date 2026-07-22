"use client";

import { useState, useTransition } from "react";
import { showToast, type ToastKind } from "./toast";

/** The shape every admin save action resolves to. */
type SaveState = { ok: boolean; error?: string };

type SaveActionOptions = {
  /** Success message. Defaults to "저장되었습니다". */
  message?: string;
  /** Toast colour — "save" (green) for create/settings, "edit" (purple) for an
   *  existing-item edit. Defaults to "save". */
  tone?: ToastKind;
  /** Runs after a successful save — e.g. navigate to the list. */
  onSuccess?: () => void;
};

/**
 * Drives an in-place admin save form off a server action.
 *
 * Replaces `useActionState` + `useSaveToast` for forms that stay on the page.
 * `run(formData)` dispatches the action inside a transition and fires the
 * success toast **imperatively the moment the action resolves** — no effect
 * watching an `isPending` edge, which proved fragile once the forms moved from
 * `<form action>` to an `onSubmit` handler (needed to stop React 19 from
 * auto-resetting the fields). Errors are left for the form's inline message.
 *
 * Pass `run` to a form's onSubmit wrapper (submitAction / guardSubmit) so the
 * action only fires after validation and the form is never auto-reset.
 */
export function useSaveAction<S extends SaveState>(
  action: (prev: S, formData: FormData) => Promise<S>,
  initial: S,
  options: SaveActionOptions = {}
): { state: S; pending: boolean; run: (formData: FormData) => void } {
  const { message = "저장되었습니다", tone = "save", onSuccess } = options;
  const [state, setState] = useState<S>(initial);
  const [pending, startTransition] = useTransition();

  const run = (formData: FormData) => {
    startTransition(async () => {
      const result = await action(state, formData);
      setState(result);
      if (result.ok && !result.error) {
        showToast(message, tone);
        onSuccess?.();
      }
    });
  };

  return { state, pending, run };
}
