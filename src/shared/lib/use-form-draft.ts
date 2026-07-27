"use client";

import { useEffect, useState } from "react";

/** A draft is just the form's string fields (files can't be persisted). */
export type DraftFields = Record<string, string>;

/**
 * Session-scoped draft for an admin form.
 *
 * - Autosave the form's fields with `save()` as the operator edits.
 * - On mount, if a draft is present, `prompt` holds it so the form can offer to
 *   restore it (a modal); the form applies it and calls `dismiss()`.
 * - A full page unload (refresh, tab close, hard navigation) drops the draft via
 *   `beforeunload`, so a reload starts clean. A soft (client-side) navigation
 *   does NOT fire that event, so the draft survives to be restored on return.
 * - `clear()` on save/cancel/discard removes it.
 *
 * Deliberately avoids any module-level "seen" tracking: that interacted badly
 * with StrictMode's double-mount and dev HMR. Mount only reads; it never clears.
 */
export function useFormDraft(key: string) {
  const storageKey = `admin-draft:${key}`;
  const [prompt, setPrompt] = useState<DraftFields | null>(null);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(storageKey);
    } catch {
      return;
    }
    if (raw) {
      try {
        setPrompt(JSON.parse(raw) as DraftFields);
      } catch {
        try {
          sessionStorage.removeItem(storageKey);
        } catch {
          /* ignore */
        }
      }
    }
  }, [storageKey]);

  useEffect(() => {
    const onUnload = () => {
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [storageKey]);

  const save = (fields: DraftFields) => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(fields));
    } catch {
      /* storage full / unavailable — a draft is best-effort */
    }
  };

  const clear = () => {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  };

  return { prompt, save, clear, dismiss: () => setPrompt(null) };
}
