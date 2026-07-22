import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Tag } from "@shared/ui";
import type { Notice } from "../model/types";
import { formatNoticeDate, getNoticeHref, isExternalNotice } from "../model/helpers";

type NoticeRowProps = {
  item: Notice;
};

const ROW_CLASS =
  "group flex items-center gap-6 border-t border-ink/10 px-4 py-6 transition-colors hover:bg-ink/3 md:gap-10 md:px-6";

/**
 * A single row in the notice list. "article" items link to the in-site detail
 * page; "external" items jump straight to their URL in a new tab.
 */
export function NoticeRow({ item }: NoticeRowProps) {
  const external = isExternalNotice(item);
  const href = getNoticeHref(item);

  const inner = (
    <>
      <time className="w-24 shrink-0 font-display text-sm font-medium tracking-wide text-ink/45">
        {formatNoticeDate(item.date)}
      </time>
      <Tag className="w-16 shrink-0 text-plum">{item.category}</Tag>
      <h3 className="flex-1 text-base font-semibold text-ink transition-transform duration-300 group-hover:translate-x-1 md:text-lg">
        {item.title}
      </h3>
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
