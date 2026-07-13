import Link from "next/link";
import { PlaceholderImage, Tag } from "@shared/ui";
import type { Content } from "../model/types";

type ContentCardProps = {
  content: Content;
};

/** Thumbnail card used in the contents grid; links to the detail page. */
export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link href={`/contents/${content.slug}`} className="group block">
      <div className="relative overflow-hidden">
        <PlaceholderImage
          label="콘텐츠 썸네일"
          ratio="16 / 9"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/5"
        />
        {content.year.includes("ONGOING") && (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.12em] text-paper">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-paper" />
            ON AIR
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2 text-plum">
        <Tag>{content.category}</Tag>
        <span aria-hidden className="text-ink/20">
          ·
        </span>
        <span className="font-display text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
          {content.year}
        </span>
      </div>
      <h3 className="mt-2 text-lg font-bold text-ink transition-colors duration-300 group-hover:text-plum">
        {content.title}
      </h3>
      <p className="mt-1 text-sm text-ink/55">{content.note}</p>
    </Link>
  );
}
