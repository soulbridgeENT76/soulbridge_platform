import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  /** Optional action node, e.g. a "새로 만들기" button. */
  action?: ReactNode;
};

/** Consistent page title row for admin screens. */
export function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-ink/55">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
