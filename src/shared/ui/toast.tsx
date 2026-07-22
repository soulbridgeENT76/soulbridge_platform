"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, Trash2, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@shared/lib/cn";

/**
 * Colour-codes feedback by the kind of action:
 * `save` (create/add or a settings save) green, `edit` (modifying an existing
 * item) purple, `delete` red, `error` red.
 */
export type ToastKind = "save" | "edit" | "delete" | "error";
type ToastItem = { id: number; message: string; kind: ToastKind };

const TONE: Record<
  ToastKind,
  { box: string; chip: string; Icon: LucideIcon }
> = {
  save: {
    box: "bg-green-600 text-white ring-green-700/20",
    chip: "bg-white/20",
    Icon: Check,
  },
  edit: {
    box: "bg-brand text-paper ring-brand/25",
    chip: "bg-paper/15",
    Icon: Pencil,
  },
  delete: {
    box: "bg-red-600 text-white ring-red-700/20",
    chip: "bg-white/20",
    Icon: Trash2,
  },
  error: {
    box: "bg-red-600 text-white ring-red-700/20",
    chip: "bg-white/20",
    Icon: TriangleAlert,
  },
};

/** How long each toast stays before auto-dismiss. */
const DURATION = 1800;

let counter = 0;
const listeners = new Set<(t: ToastItem) => void>();

/**
 * Fire a toast from anywhere in a client component — no context/provider to
 * thread. `<Toaster />` (mounted once in the admin shell) picks it up.
 */
export function showToast(message: string, kind: ToastKind = "save") {
  const item: ToastItem = { id: (counter += 1), message, kind };
  listeners.forEach((notify) => notify(item));
}

/** Container that renders and auto-dismisses toasts. Mount once per app shell. */
export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (t: ToastItem) => {
      setItems((cur) => [...cur, t]);
      setTimeout(() => {
        setItems((cur) => cur.filter((x) => x.id !== t.id));
      }, DURATION);
    };
    listeners.add(onToast);
    return () => {
      listeners.delete(onToast);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((t) => (
        <ToastCard key={t.id} item={t} />
      ))}
    </div>
  );
}

function ToastCard({ item }: { item: ToastItem }) {
  // Drop + fade in from the top (rAF so the initial hidden state paints first).
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, []);

  const tone = TONE[item.kind];
  const Icon = tone.Icon;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex max-w-[90vw] items-center gap-2.5 rounded-2xl px-6 py-4 text-base font-semibold shadow-xl ring-1 transition-all duration-300 ease-out",
        tone.box,
        shown ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          tone.chip,
        )}
      >
        <Icon size={16} strokeWidth={2.5} />
      </span>
      {item.message}
    </div>
  );
}
