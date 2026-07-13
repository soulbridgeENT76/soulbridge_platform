import Link from "next/link";
import { PlaceholderImage } from "@shared/ui";
import type { Artist } from "../model/types";

type ArtistCardProps = {
  artist: Artist;
  /** 1-based position, shown as an editorial index (e.g. "01"). */
  index?: number;
};

/** Portrait card used in the artist grid; links to the detail page. */
export function ArtistCard({ artist, index }: ArtistCardProps) {
  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      <div className="relative overflow-hidden">
        <PlaceholderImage
          label={`${artist.nameKo} · 프로필`}
          ratio="3 / 4"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {index != null && (
          <span className="absolute left-4 top-4 font-display text-xs font-semibold tracking-widest text-ink/40">
            {String(index).padStart(2, "0")}
          </span>
        )}
        {/* Hover veil */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/5"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-ink/10 pt-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
            {artist.nameKo}
            <span
              aria-hidden
              className="translate-x-[-4px] text-sm text-plum opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            >
              →
            </span>
          </h3>
          <p className="font-display text-xs font-medium uppercase tracking-[0.18em] text-ink/45">
            {artist.nameEn}
          </p>
        </div>
        <span className="shrink-0 text-sm text-plum">{artist.role}</span>
      </div>
    </Link>
  );
}
