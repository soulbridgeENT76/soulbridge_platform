"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterTabs } from "@shared/ui";
import {
  CONTENTS,
  CONTENT_CATEGORIES,
  ContentCard,
  type ContentCategory,
} from "@entities/content";
import { cn } from "@shared/lib/cn";

type Filter = "ALL" | ContentCategory;

const OPTIONS: Filter[] = ["ALL", ...CONTENT_CATEGORIES];
const PAGE_SIZE = 8;

/** Category-filterable, paginated grid of content cards. */
export function ContentFilter() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [page, setPage] = useState(1);

  const items = useMemo(
    () =>
      filter === "ALL"
        ? CONTENTS
        : CONTENTS.filter((c) => c.category === filter),
    [filter]
  );

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = items.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE
  );

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <div>
      <FilterTabs options={OPTIONS} value={filter} onChange={changeFilter} />

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageItems.map((content) => (
          <ContentCard key={content.slug} content={content} />
        ))}
      </div>

      <nav
        aria-label="페이지"
        className="mt-16 flex items-center justify-center gap-2"
      >
          <PageButton
            aria-label="이전 페이지"
            disabled={current === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </PageButton>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <PageButton
              key={n}
              active={n === current}
              aria-current={n === current}
              onClick={() => setPage(n)}
            >
              {n}
            </PageButton>
          ))}

          <PageButton
            aria-label="다음 페이지"
            disabled={current === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </PageButton>
        </nav>
    </div>
  );
}

type PageButtonProps = React.ComponentProps<"button"> & {
  active?: boolean;
};

function PageButton({ active, className, ...props }: PageButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 min-w-10 items-center justify-center rounded-full px-3 font-display text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-30",
        active
          ? "bg-ink text-paper"
          : "text-ink/60 hover:bg-ink/5 hover:text-ink",
        className
      )}
      {...props}
    />
  );
}
