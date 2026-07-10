"use client";

import { useMemo, useState } from "react";
import { FilterTabs } from "@shared/ui";
import {
  NEWS,
  NEWS_CATEGORIES,
  NewsRow,
  type NewsCategory,
} from "@entities/news";

type Filter = "ALL" | NewsCategory;

const OPTIONS: Filter[] = ["ALL", ...NEWS_CATEGORIES];

/** Category-filterable list of news rows. */
export function NewsFilter() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const items = useMemo(
    () => (filter === "ALL" ? NEWS : NEWS.filter((n) => n.category === filter)),
    [filter]
  );

  return (
    <div>
      <FilterTabs options={OPTIONS} value={filter} onChange={setFilter} />
      <div className="mt-10 border-b border-ink/10">
        {items.map((item) => (
          <NewsRow key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
