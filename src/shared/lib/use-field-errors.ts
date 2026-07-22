"use client";

import {
  useEffect,
  useRef,
  useState,
  startTransition,
  type FormEvent,
} from "react";

/**
 * Client-side field validation shared by the admin forms.
 *
 * Every form shows the same way: an invalid field flashes a message beside its
 * own label (AdminField `error`), turns its border red (aria-invalid), and the
 * first invalid field takes focus. This owns the transient-message timer and
 * the validate-then-submit wrapper so each form only writes its rules.
 *
 * The server actions re-check the same rules — this is UX, not the guarantee.
 */
export function useFieldErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Drop one field's message — call from its onChange so typing clears it. */
  const clearError = (field: string) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  /** Show messages briefly, then let them fade on their own. */
  const flashErrors = (next: Record<string, string>) => {
    if (timer.current) clearTimeout(timer.current);
    setErrors(next);
    timer.current = setTimeout(() => {
      setErrors({});
      timer.current = null;
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  /** Focus the first field (in `order`) that currently has an error. */
  const focusFirst = (errs: Record<string, string>, order: readonly string[]) => {
    const first = order.find((field) => errs[field]);
    if (first) document.getElementById(first)?.focus();
  };

  /**
   * onSubmit handler: validate first, and on any error flash the messages,
   * focus the first invalid field, and skip the submit.
   *
   * Bound to `onSubmit` (not `<form action>`) on purpose: React 19 auto-resets
   * a form after its `action` runs — even when the action bails early on a
   * validation error — which wipes what the operator typed. Calling
   * preventDefault and dispatching the action ourselves keeps the fields intact.
   */
  const guardSubmit =
    (
      validate: (formData: FormData) => Record<string, string>,
      order: readonly string[],
      action: (formData: FormData) => void
    ) =>
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const errs = validate(formData);
      if (Object.keys(errs).length > 0) {
        flashErrors(errs);
        focusFirst(errs, order);
        return;
      }
      // A useActionState dispatch (or a useSaveAction run) must be invoked
      // inside a transition — React 19 warns otherwise and isPending stops
      // tracking. onSubmit hands us a plain event, so we open one here.
      startTransition(() => action(formData));
    };

  return { errors, clearError, flashErrors, focusFirst, guardSubmit };
}

/**
 * onSubmit handler for forms with no client validation. Same reason as
 * guardSubmit: preventDefault stops React 19 from auto-resetting the form
 * (which would discard the operator's input) after the action runs — relevant
 * when the server action returns an error and the form stays on screen.
 */
export function submitAction(action: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // See guardSubmit: the dispatch has to run inside a transition.
    startTransition(() => action(formData));
  };
}

/** Trimmed string value of a FormData field. */
export const fieldValue = (formData: FormData, name: string): string =>
  String(formData.get(name) ?? "").trim();
