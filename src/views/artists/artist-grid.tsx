"use client";

import { useState } from "react";
import { Pagination } from "@shared/ui";
import { ARTISTS, ArtistCard } from "@entities/artist";

const PAGE_SIZE = 8;

/** Paginated artist grid. */
export function ArtistGrid() {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(ARTISTS.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = ARTISTS.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-3 xl:grid-cols-4">
        {pageItems.map((artist, i) => (
          <ArtistCard key={artist.slug} artist={artist} index={start + i + 1} />
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
