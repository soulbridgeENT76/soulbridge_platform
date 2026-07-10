"use client";

import { useMemo, useState } from "react";
import { FilterTabs } from "@shared/ui";
import {
  CONTENTS,
  CONTENT_CATEGORIES,
  ContentCard,
  type ContentCategory,
} from "@entities/content";

type Filter = "ALL" | ContentCategory;

const OPTIONS: Filter[] = ["ALL", ...CONTENT_CATEGORIES];

/** Category-filterable grid of content cards. */
export function ContentFilter() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const items = useMemo(
    () =>
      filter === "ALL"
        ? CONTENTS
        : CONTENTS.filter((c) => c.category === filter),
    [filter]
  );

  return (
    <div>
      <FilterTabs options={OPTIONS} value={filter} onChange={setFilter} />
      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((content) => (
          <ContentCard key={content.slug} content={content} />
        ))}
      </div>
    </div>
  );
}
