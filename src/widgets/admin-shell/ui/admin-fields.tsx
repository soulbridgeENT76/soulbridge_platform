import type { ComponentProps, ReactNode } from "react";
import { cn } from "@shared/lib/cn";

const controlBase =
  "w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand";

/** Labeled field wrapper. */
export function AdminField({
  label,
  htmlFor,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
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
