import type { ComponentProps, ReactNode } from "react";
import { cn } from "@shared/lib/cn";

const controlBase =
  // aria-invalid rules win by specificity (attr + pseudo), so a red border
  // shows without fighting the base border/focus classes.
  "w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:border-red-500";

/** Labeled field wrapper. */
export function AdminField({
  label,
  htmlFor,
  hint,
  required,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  /** Transient validation message shown inline next to the label. */
  error?: string | null;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
        {error && (
          <span className="ml-2 text-xs font-medium text-red-600">{error}</span>
        )}
      </label>
      {children}
      {hint && <p className="text-xs text-ink/45">{hint}</p>}
    </div>
  );
}

export function AdminInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlBase, className)} {...props} />;
}

export function AdminTextarea({
  className,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(controlBase, "min-h-32 resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function AdminSelect({
  className,
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <select className={cn(controlBase, "appearance-none", className)} {...props}>
      {children}
    </select>
  );
}

/** Two-column responsive grid for form fields. */
export function AdminFormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2">{children}</div>;
}
