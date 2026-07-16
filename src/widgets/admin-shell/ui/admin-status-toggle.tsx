"use client";

import { useState } from "react";
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
};

/**
 * Compact on/off switch for publish state. Used both in list rows (toggle
 * saves immediately) and inside forms (submits with the form via `name`).
 * TODO(backend): in list rows, PATCH on toggle and revert on failure.
 */
export function AdminStatusToggle({
  initial,
  itemName,
  name,
}: AdminStatusToggleProps) {
  const [active, setActive] = useState(initial);

  const toggle = () => {
    setActive((v) => !v);
    // TODO(backend): when used without `name`, PATCH this item's `active` field.
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
        className="inline-flex items-center gap-2"
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
