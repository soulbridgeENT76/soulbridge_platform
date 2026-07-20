import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Tag } from "@shared/ui";
import type { NewsItem } from "../model/types";
import { formatNewsDate, getNewsHref, isExternalNews } from "../model/news";

type NewsRowProps = {
  item: NewsItem;
};

const ROW_CLASS =
  "group flex items-center gap-6 border-t border-ink/10 py-6 transition-colors hover:bg-ink/3 md:gap-10";

/**
 * A single row in the news list. "article" items link to the in-site detail
 * page; "external" items jump straight to their URL in a new tab.
 */
export function NewsRow({ item }: NewsRowProps) {
  const external = isExternalNews(item);
  const href = getNewsHref(item);

  const inner = (
    <>
      <time className="w-24 shrink-0 font-display text-sm font-medium tracking-wide text-ink/45">
        {formatNewsDate(item.date)}
      </time>
      <Tag className="w-16 shrink-0 text-plum">{item.category}</Tag>
      <h3 className="flex-1 text-base font-semibold text-ink transition-transform duration-300 group-hover:translate-x-1 md:text-lg">
        {item.title}
      </h3>
      {/* Leaves-the-site cue, shown only for external rows. */}
      {external && (
        <ArrowUpRight
          size={18}
          className="shrink-0 text-ink/30 transition-colors group-hover:text-plum"
        />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={ROW_CLASS}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={ROW_CLASS}>
      {inner}
    </Link>
  );
}
