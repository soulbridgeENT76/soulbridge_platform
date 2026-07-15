"use client";

import { useMemo, useState } from "react";
import { FilterTabs, Pagination } from "@shared/ui";
import {
  NEWS,
  NEWS_CATEGORIES,
  NewsRow,
  type NewsCategory,
} from "@entities/news";

type Filter = "ALL" | NewsCategory;

const OPTIONS: Filter[] = ["ALL", ...NEWS_CATEGORIES];
const PAGE_SIZE = 10;

/** Category-filterable, paginated list of news rows. */
export function NewsFilter() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [page, setPage] = useState(1);

  const items = useMemo(
    () => (filter === "ALL" ? NEWS : NEWS.filter((n) => n.category === filter)),
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
      <div className="mt-10 border-b border-ink/10">
        {pageItems.map((item) => (
          <NewsRow key={item.slug} item={item} />
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
