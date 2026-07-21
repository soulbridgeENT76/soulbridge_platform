"use client";

import { useState, useTransition } from "react";
import { showToast } from "@shared/ui/toast";
import { cn } from "@shared/lib/cn";

type AdminStatusToggleProps = {
  /** Current publish state. */
  initial: boolean;
  /** Used for the accessible label, e.g. the row's title. */
  itemName: string;
  /**
   * When set, the value is submitted with the surrounding form under this
   * name. Omit in list rows, where the toggle saves on its own.
   */
  name?: string;
  /**
   * Bound server action that persists the new state immediately. When set, the
   * toggle saves on click (optimistic, reverting on failure) rather than
   * waiting for a form submit. Mutually exclusive with `name`.
   */
  action?: (active: boolean) => Promise<{ ok: boolean; error?: string }>;
};

/**
 * Compact on/off switch for publish state. Used in list rows (with `action`, it
 * saves immediately), inside forms (submits with the form via `name`), or as a
 * still-unwired stub (neither prop).
 */
export function AdminStatusToggle({
  initial,
  itemName,
  name,
  action,
}: AdminStatusToggleProps) {
  const [active, setActive] = useState(initial);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !active;
    setActive(next); // optimistic

    if (!action) return;
    startTransition(async () => {
      const result = await action(next);
      if (result.ok) {
        showToast(next ? "메뉴에 노출됩니다" : "메뉴에서 숨겨집니다");
      } else {
        setActive(!next); // revert
        showToast(result.error ?? "저장에 실패했습니다.", "error");
      }
    });
  };

  return (
    <>
      {name && <input type="hidden" name={name} value={String(active)} />}
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={`${itemName} ${active ? "비활성으로 전환" : "활성으로 전환"}`}
        onClick={toggle}
        disabled={pending}
        className="inline-flex items-center gap-2 disabled:opacity-60"
      >
        {/* Knob is placed with flex alignment (no absolute/transform) so it can
            never escape the track or overlap the label. */}
        <span
          className={cn(
            "flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors",
            active ? "justify-end bg-brand" : "justify-start bg-ink/20"
          )}
        >
          <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
        </span>
        <span
          className={cn(
            "shrink-0 text-xs font-semibold transition-colors",
            active ? "text-brand" : "text-ink/45"
          )}
        >
          {active ? "활성" : "비활성"}
        </span>
      </button>
    </>
  );
}
