"use client";

import { useMemo, useState } from "react";
import { FilterTabs, Pagination } from "@shared/ui";
// Card from its own module, not the entity barrel: this is a client component
// and the barrel also exports the server-only readers.
import { ContentCard } from "@entities/content/ui/content-card";
import type { Content } from "@entities/content/model/types";

const PAGE_SIZE = 8;

/**
 * Category-filterable, paginated grid. The lineup and the category list are
 * both resolved by the parent — categories come from the DB, so the tabs match
 * whatever the admin has added.
 */
export function ContentFilter({
  contents,
  categories,
}: {
  contents: Content[];
  categories: string[];
}) {
  const options = ["ALL", ...categories];
  const [filter, setFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const items = useMemo(() => {
    // Order is fixed to creation date (newest first) by the DB read; filtering
    // by category preserves it. No year-based re-sort.
    return filter === "ALL"
      ? contents
      : contents.filter((c) => c.category === filter);
  }, [filter, contents]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const changeFilter = (next: string) => {
    setFilter(next);
    setPage(1);
  };

  // An empty lineup is a real state now that contents are CMS-driven.
  if (contents.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-ink/45">
        등록된 콘텐츠가 없습니다.
      </p>
    );
  }

  return (
    <div>
      <FilterTabs options={options} value={filter} onChange={changeFilter} />

      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageItems.map((content) => (
          <ContentCard key={content.id} content={content} />
        ))}
      </div>

      <Pagination
        page={current}
        totalPages={totalPages}
        onChange={setPage}
        className="mt-16"
      />
    </div>
  );
}
