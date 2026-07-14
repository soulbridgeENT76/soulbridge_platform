import Link from "next/link";
import { Tag } from "@shared/ui";
import type { NewsItem } from "../model/types";
import { formatNewsDate } from "../model/news";

type NewsRowProps = {
  item: NewsItem;
};

/** A single row in the news list; links to the detail page. */
export function NewsRow({ item }: NewsRowProps) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex items-center gap-6 border-t border-ink/10 py-6 transition-colors hover:bg-ink/[0.03] md:gap-10"
    >
      <time className="w-24 shrink-0 font-display text-sm font-medium tracking-wide text-ink/45">
        {formatNewsDate(item.date)}
      </time>
      <Tag className="w-16 shrink-0 text-plum">{item.category}</Tag>
      <h3 className="flex-1 text-base font-semibold text-ink transition-transform duration-300 group-hover:translate-x-1 md:text-lg">
        {item.title}
      </h3>
    </Link>
  );
}
