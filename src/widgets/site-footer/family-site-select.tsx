"use client";

import { SOCIALS } from "@shared/config/site";

/** "FAMILY SITE" dropdown: navigates to the chosen related site in a new tab. */
export function FamilySiteSelect() {
  return (
    <select
      aria-label="FAMILY SITE"
      defaultValue=""
      onChange={(e) => {
        const url = e.target.value;
        if (url && url !== "#") window.open(url, "_blank", "noopener");
        e.target.selectedIndex = 0;
      }}
      className="h-10 w-56 cursor-pointer rounded-sm bg-paper px-3 font-display text-xs font-medium uppercase tracking-[0.12em] text-ink outline-none"
    >
      <option value="" disabled>
        SELECT
      </option>
      {SOCIALS.map((s) => (
        <option key={s.label} value={s.href}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
