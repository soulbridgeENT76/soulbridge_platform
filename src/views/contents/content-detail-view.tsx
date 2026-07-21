import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container, PlaceholderImage, Tag } from "@shared/ui";
import { UPLOAD_SIZE } from "@shared/config/media";
import { CONTENT_THUMB_RATIO, type Content } from "@entities/content";

type ContentDetailViewProps = {
  content: Content;
};

/**
 * Content only — the page owns PageShell so the chrome can prerender while this
 * streams in behind a Suspense boundary (the slug is runtime data).
 */
export function ContentDetailView({ content }: ContentDetailViewProps) {
  const isYoutube = content.mediaType === "youtube";
  const watchUrl = content.youtubeId
    ? `https://www.youtube.com/watch?v=${content.youtubeId}`
    : null;

  return (
    <Container className="pb-24 pt-16 md:pt-24">
       <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-2 text-plum">
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

        {isYoutube ? (
          /* Video content: player first, description below */
          <div className="mx-auto mt-10 max-w-5xl">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-ink">
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

            <p className="mt-10 whitespace-pre-line text-base leading-relaxed text-ink/70 md:text-lg">
              {content.synopsis || content.note}
            </p>
          </div>
        ) : (
          /* Non-video IP: 16:9 image + description stacked */
          <>
            <div className="mx-auto mt-10 max-w-5xl">
              {content.thumbnail ? (
                <Image
                  src={content.thumbnail}
                  alt={content.title}
                  width={UPLOAD_SIZE.landscape.width}
                  height={UPLOAD_SIZE.landscape.height}
                  sizes="(min-width: 1024px) 64rem, 100vw"
                  priority
                  className="w-full rounded-2xl object-cover"
                  style={{ aspectRatio: CONTENT_THUMB_RATIO }}
                />
              ) : (
                <PlaceholderImage
                  label="콘텐츠 대표 이미지"
                  ratio={CONTENT_THUMB_RATIO}
                />
              )}
            </div>
            <p className="mt-10 whitespace-pre-line text-base leading-relaxed text-ink/70 md:text-lg">
              {content.synopsis || content.note}
            </p>
          </>
        )}

        {/* Back-to-list CTA */}
        <div className="mt-16 flex justify-center border-t border-ink/10 pt-14">
          <Link
            href="/contents"
            className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.15em] text-paper transition-transform hover:scale-[1.03]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            BACK TO CONTENTS
          </Link>
        </div>
       </div>
    </Container>
  );
}
