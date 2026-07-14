"use client";

import { useMemo, useState } from "react";
import { FilterTabs, Pagination } from "@shared/ui";
import {
  CONTENTS,
  CONTENT_CATEGORIES,
  ContentCard,
  type ContentCategory,
} from "@entities/content";

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
  const pageItems = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

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

      <Pagination
        page={current}
        totalPages={totalPages}
        onChange={setPage}
        className="mt-16"
      />
    </div>
  );
}
