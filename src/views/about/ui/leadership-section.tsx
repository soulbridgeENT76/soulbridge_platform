import Image from "next/image";
import { PlaceholderImage } from "@shared/ui";
import { PORTRAIT_RATIO, UPLOAD_SIZE } from "@shared/config/media";
import type { AboutLeadership } from "@entities/page-content";
import { AboutSection } from "./about-section";

export function LeadershipSection({ leader }: { leader: AboutLeadership }) {
  return (
    <AboutSection index="01" eyebrow={leader.label}>
      <div className="grid max-w-5xl gap-8 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-12">
        <div className="self-start overflow-hidden rounded-md shadow-[0_8px_24px_rgba(36,24,30,0.10)]">
          {leader.photo ? (
            <Image
              src={leader.photo}
              alt={leader.name}
              width={UPLOAD_SIZE.portrait.width}
              height={UPLOAD_SIZE.portrait.height}
              sizes="(min-width: 640px) 18rem, 100vw"
              className="h-auto w-full object-cover"
            />
          ) : (
            <PlaceholderImage
              label="대표 프로필 이미지"
              ratio={PORTRAIT_RATIO}
            />
          )}
        </div>
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-plum">
            {leader.role}
          </p>
          <h3 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            {leader.name}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-ink/65">
            {leader.bio.replace(/\n/g, " ")}
          </p>
          <ul className="mt-7 space-y-3 border-t border-ink/10 pt-6">
            {leader.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-sm text-ink/70 md:text-base"
              >
                <span aria-hidden className="text-plum">
                  —
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AboutSection>
  );
}
