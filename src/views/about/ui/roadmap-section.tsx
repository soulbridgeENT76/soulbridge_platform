import { ROADMAP } from "@entities/roadmap";
import { AboutSection } from "./about-section";

/** 3-year growth roadmap as a vertical timeline. */
export function RoadmapSection() {
  return (
    <AboutSection index="04" eyebrow="ROADMAP" title="3개년 성장 로드맵">
      <ol className="relative flex flex-col gap-10 border-l border-ink/15 pl-8">
        {ROADMAP.map((item) => (
          <li key={item.phase} className="relative">
            {/* Timeline node */}
            <span
              aria-hidden
              className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full bg-plum ring-4 ring-paper"
            />
            <div className="flex flex-wrap items-baseline gap-x-4">
              <span className="font-display text-xs font-semibold tracking-widest text-plum">
                {item.phase}
              </span>
              <span className="font-display text-xs font-semibold tracking-widest text-ink/45">
                {item.period}
              </span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-ink md:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60 md:text-base">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </AboutSection>
  );
}
