"use client";

import { useMemo, useState } from "react";
import { FilterTabs, Pagination } from "@shared/ui";
// Row + type from their own modules, not the entity barrel: this is a client
// component and the barrel also exports the server-only readers.
import { NoticeRow } from "@entities/notices/ui/notice-row";
import type { Notice } from "@entities/notices/model/types";

const PAGE_SIZE = 10;

/** Category-filterable, paginated list. Notices + categories from the parent. */
export function NoticeFilter({
  notices,
  categories,
}: {
  notices: Notice[];
  categories: string[];
}) {
  const [filter, setFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const options = ["ALL", ...categories];

  const items = useMemo(
    () =>
      filter === "ALL" ? notices : notices.filter((n) => n.category === filter),
    [filter, notices]
  );

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const changeFilter = (next: string) => {
    setFilter(next);
    setPage(1);
  };

  if (notices.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-ink/45">
        등록된 소식이 없습니다.
      </p>
    );
  }

  return (
    <div>
      <FilterTabs options={options} value={filter} onChange={changeFilter} />
      <div className="mt-10 border-b border-ink/10">
        {pageItems.map((item) => (
          <NoticeRow key={item.id} item={item} />
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
