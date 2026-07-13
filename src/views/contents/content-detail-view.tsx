import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageShell } from "@widgets/page-shell";
import { Container, PlaceholderImage, Tag } from "@shared/ui";
import type { Content } from "@entities/content";

type ContentDetailViewProps = {
  content: Content;
};

export function ContentDetailView({ content }: ContentDetailViewProps) {
  const isYoutube = content.category === "YOUTUBE";
  const watchUrl = content.youtubeId
    ? `https://www.youtube.com/watch?v=${content.youtubeId}`
    : null;

  return (
    <PageShell>
      <Container className="pb-24 pt-16 md:pt-24">
        {/* Back to list */}
        <Link
          href="/contents"
          className="inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.15em] text-ink/45 transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} />
          콘텐츠 목록
        </Link>

        {/* Header */}
        <div className="mt-8 flex items-center gap-2 text-plum">
          <Tag>{content.category}</Tag>
          <span aria-hidden className="text-ink/20">
            ·
          </span>
          <span className="font-display text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
            {content.year}
          </span>
        </div>
        <h1 className="mt-4 max-w-3xl text-4xl/[1.2] font-bold tracking-tight text-ink md:text-5xl/[1.15]">
          {content.title}
        </h1>
        <p className="mt-3 text-lg text-ink/55">{content.note}</p>

        {/* Hero image */}
        <div className="mt-10 max-w-4xl">
          <PlaceholderImage label="콘텐츠 대표 이미지" ratio="16 / 9" />
        </div>

        {/* Synopsis */}
        <p className="mt-10 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">
          {content.synopsis ?? content.description ?? content.note}
        </p>

        {/* YouTube player + link (video content only) */}
        {isYoutube && (
          <div className="mt-16 max-w-4xl border-t border-ink/10 pt-12">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-plum">
              WATCH
            </p>

            <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-ink">
              {content.youtubeId ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${content.youtubeId}?rel=0&modestbranding=1`}
                  title={content.title}
                  allow="accelerated-sensors; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-xs font-semibold uppercase tracking-[0.2em] text-paper/40">
                  영상 링크 준비 중
                </div>
              )}
            </div>

            {watchUrl && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noreferrer"
                className="group mt-6 inline-flex items-center gap-2 border-b border-ink/25 pb-1 font-display text-sm font-semibold tracking-wide text-ink/80 transition-colors hover:border-ink hover:text-ink"
              >
                YouTube에서 보기
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            )}
          </div>
        )}
      </Container>
    </PageShell>
  );
}
