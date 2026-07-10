import { PlaceholderImage } from "@shared/ui";
import { LEADERSHIP } from "@entities/about";
import { AboutSection } from "./about-section";

export function LeadershipSection() {
  return (
    <AboutSection index="01" eyebrow="LEADERSHIP">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-10">
        <PlaceholderImage label="대표 프로필 이미지" ratio="4 / 5" />
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-plum">
            {LEADERSHIP.role}
          </p>
          <h3 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            {LEADERSHIP.nameKo}
          </h3>
          <p className="mt-5 whitespace-pre text-base leading-relaxed text-ink/65">
            {LEADERSHIP.bio}
          </p>
          <ul className="mt-7 space-y-3 border-t border-ink/10 pt-6">
            {LEADERSHIP.points.map((point) => (
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
