import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@widgets/page-shell";
import { Container, Tag } from "@shared/ui";
import { formatNewsDate, type NewsItem } from "@entities/news";

type NewsDetailViewProps = {
  item: NewsItem;
};

export function NewsDetailView({ item }: NewsDetailViewProps) {
  return (
    <PageShell>
      <Container className="pb-24 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl">
          {/* Back to list */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.15em] text-ink/45 transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} />
            뉴스 목록
          </Link>

          {/* Header */}
          <div className="mt-8 flex items-center gap-4">
            <Tag className="text-plum">{item.category}</Tag>
            <time className="font-display text-sm font-medium tracking-wide text-ink/45">
              {formatNewsDate(item.date)}
            </time>
          </div>
          <h1 className="mt-5 whitespace-pre-line text-3xl/[1.3] font-bold tracking-tight text-ink md:text-4xl/[1.25]">
            {item.title}
          </h1>

          {/* Body */}
          {item.body && (
            <div className="mt-10 border-t border-ink/10 pt-10">
              <p className="whitespace-pre-line text-base leading-relaxed text-ink/70 md:text-lg">
                {item.body}
              </p>
            </div>
          )}
        </div>
      </Container>
    </PageShell>
  );
}
