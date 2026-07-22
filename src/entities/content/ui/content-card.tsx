import Link from "next/link";
import Image from "next/image";
import { FaYoutube } from "react-icons/fa";
import { PlaceholderImage } from "@shared/ui";
import { UPLOAD_SIZE } from "@shared/config/media";
import type { Content } from "../model/types";
import { CONTENT_THUMB_RATIO } from "../model/types";

type ContentCardProps = {
  content: Content;
};

/** Thumbnail card used in the contents grid; links to the detail page. */
export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link href={`/contents/${content.ref}`} className="group block">
      <div className="relative overflow-hidden rounded-md shadow-[0_8px_24px_rgba(36,24,30,0.10)]">
        {/* Placeholder stays the fallback for a content with no media set. */}
        {content.preview ? (
          <Image
            src={content.preview}
            alt={content.title}
            width={UPLOAD_SIZE.landscape.width}
            height={UPLOAD_SIZE.landscape.height}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            style={{ aspectRatio: CONTENT_THUMB_RATIO }}
            className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <PlaceholderImage
            label="콘텐츠 썸네일"
            ratio={CONTENT_THUMB_RATIO}
            className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

        {/* A play badge marks video content apart from a still image. */}
        {content.mediaType === "youtube" && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <FaYoutube
              className="text-5xl text-white/95 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110"
              aria-hidden
            />
          </span>
        )}
      </div>
      <div className="mt-4">
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
