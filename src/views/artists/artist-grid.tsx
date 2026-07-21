"use client";

import { useState } from "react";
import { Pagination } from "@shared/ui";
// The card comes from its own module, not the entity barrel: this is a client
// component, and the barrel also exports the server-only readers (`"use cache"`
// and the cookie-bearing client), which must not enter the client graph.
// The Artist import is type-only, so it is erased and costs nothing.
import { ArtistCard } from "@entities/artist/ui/artist-card";
import type { Artist } from "@entities/artist";

const PAGE_SIZE = 8;

/** Paginated artist grid. The roster is resolved by the server parent. */
export function ArtistGrid({ artists }: { artists: Artist[] }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(artists.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = artists.slice(start, start + PAGE_SIZE);

  // An empty roster is a real state now that the list is CMS-driven — say so,
  // rather than render a bare grid under a lone pagination control.
  if (artists.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-ink/45">
        등록된 아티스트가 없습니다.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-3 xl:grid-cols-4">
        {pageItems.map((artist, i) => (
          <ArtistCard key={artist.id} artist={artist} index={start + i + 1} />
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
