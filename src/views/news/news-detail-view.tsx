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
        {/* min-height keeps even short articles tall enough to scroll, so the
            fixed header doesn't shift when the scrollbar appears/disappears. */}
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
          {/* Header */}
          <div className="text-plum">
            <Tag>{item.category}</Tag>
          </div>
          <h1 className="mt-5 whitespace-pre-line text-2xl/[1.3] font-bold tracking-tight text-ink md:text-3xl/[1.25]">
            {item.title}
          </h1>

          {/* Byline: author + date */}
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/50">
            <span>
              작성자{" "}
              <span className="text-ink/70">
                {item.author ?? "소울브릿지ENT"}
              </span>
            </span>
            <span aria-hidden className="text-ink/20">
              ·
            </span>
            <span>작성일 {formatNewsDate(item.date)}</span>
          </div>

          {/* Body */}
          {item.body && (
            <div className="mt-10 border-t border-ink/10 pt-10">
              <p className="max-w-4xl whitespace-pre-line text-base leading-[2] text-ink/70 md:text-lg">
                {item.body}
              </p>
            </div>
          )}

          {/* Back-to-list CTA */}
          <div className="mt-16 flex justify-center border-t border-ink/10 pt-14">
            <Link
              href="/news"
              className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.15em] text-paper transition-transform hover:scale-[1.03]"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              BACK TO NEWS
            </Link>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
