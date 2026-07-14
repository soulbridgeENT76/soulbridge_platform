import type { ComponentProps } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@shared/lib/cn";

type PaginationProps = {
  /** Current 1-based page. */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
};

/**
 * Controlled numbered pagination. State lives in the parent (a client feature),
 * so this stays a simple presentational component.
 */
export function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: PaginationProps) {
  return (
    <nav
      aria-label="페이지"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <PageButton
        aria-label="이전 페이지"
        disabled={page === 1}
        onClick={() => onChange(Math.max(1, page - 1))}
      >
        <ChevronLeft size={16} />
      </PageButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <PageButton
          key={n}
          active={n === page}
          aria-current={n === page}
          onClick={() => onChange(n)}
        >
          {n}
        </PageButton>
      ))}

      <PageButton
        aria-label="다음 페이지"
        disabled={page === totalPages}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
      >
        <ChevronRight size={16} />
      </PageButton>
    </nav>
  );
}

type PageButtonProps = ComponentProps<"button"> & { active?: boolean };

function PageButton({ active, className, ...props }: PageButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 min-w-10 items-center justify-center rounded-full px-3 font-display text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-30",
        active
          ? "bg-brand text-paper"
          : "text-ink/60 hover:bg-brand/10 hover:text-brand",
        className
      )}
      {...props}
    />
  );
}
