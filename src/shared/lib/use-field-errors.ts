"use client";

import { useEffect, useRef, useState } from "react";

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
   * Wraps a FormData action: validate first, and on any error flash the
   * messages, focus the first invalid field, and skip the submit.
   */
  const guardAction =
    (
      validate: (formData: FormData) => Record<string, string>,
      order: readonly string[],
      action: (formData: FormData) => void
    ) =>
    (formData: FormData) => {
      const errs = validate(formData);
      if (Object.keys(errs).length > 0) {
        flashErrors(errs);
        focusFirst(errs, order);
        return;
      }
      action(formData);
    };

  return { errors, clearError, flashErrors, focusFirst, guardAction };
}

/** Trimmed string value of a FormData field. */
export const fieldValue = (formData: FormData, name: string): string =>
  String(formData.get(name) ?? "").trim();
