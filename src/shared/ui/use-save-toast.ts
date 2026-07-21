"use client";

import { useEffect, useRef } from "react";
import { showToast } from "./toast";

/** The shape every admin save action resolves to. */
type SaveState = { ok: boolean; error?: string };

/**
 * Toasts once per successful save, for a form driven by `useActionState`.
 *
 * Keyed off the submission itself — the `isPending` flag going true and then
 * false — rather than off the state object changing identity. Identity looks
 * like it should work, but it reports a save that this mount never made:
 * remounting the editor (navigating away and back) can settle `state` to the
 * retained post-save value a render after the initial one was captured, which
 * reads as a fresh save and fires a toast on arrival. StrictMode's double
 * invocation then makes it two.
 *
 * Watching `isPending` cannot produce that: a mount that never submitted never
 * sees a pending phase. The phase is also consumed before the toast fires, so
 * a repeated effect run is a no-op rather than a second toast.
 *
 * Errors are left alone — each form renders its own inline message, which
 * stays on screen instead of auto-dismissing like a toast would.
 */
export function useSaveToast(
  state: SaveState,
  isPending: boolean,
  message = "저장되었습니다"
): void {
  const submitted = useRef(false);
  // Read the message from the latest render without letting it retrigger the
  // effect — only the end of a submission should announce anything.
  const latestMessage = useRef(message);
  latestMessage.current = message;

  useEffect(() => {
    if (isPending) {
      submitted.current = true;
      return;
    }
    if (!submitted.current) return;
    submitted.current = false;
    if (state.ok && !state.error) showToast(latestMessage.current);
  }, [isPending, state]);
}
