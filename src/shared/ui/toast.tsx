"use client";

import { useEffect, useState } from "react";
import { Check, TriangleAlert } from "lucide-react";
import { cn } from "@shared/lib/cn";

export type ToastKind = "success" | "error";
type ToastItem = { id: number; message: string; kind: ToastKind };

/** How long each toast stays before auto-dismiss. */
const DURATION = 1800;

let counter = 0;
const listeners = new Set<(t: ToastItem) => void>();

/**
 * Fire a toast from anywhere in a client component — no context/provider to
 * thread. `<Toaster />` (mounted once in the admin shell) picks it up.
 */
export function showToast(message: string, kind: ToastKind = "success") {
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

  const error = item.kind === "error";
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto flex max-w-[90vw] items-center gap-2.5 rounded-2xl px-6 py-4 text-base font-semibold shadow-xl ring-1 transition-all duration-300 ease-out",
        error
          ? "bg-red-600 text-white ring-red-700/20"
          : "bg-brand text-paper ring-brand/20",
        shown ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          error ? "bg-white/20" : "bg-paper/15",
        )}
      >
        {error ? <TriangleAlert size={16} /> : <Check size={16} strokeWidth={2.5} />}
      </span>
      {item.message}
    </div>
  );
}
