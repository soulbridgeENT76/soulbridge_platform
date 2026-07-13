import { ROADMAP } from "@entities/roadmap";
import { Container } from "@shared/ui";

/** 3-year growth roadmap as a full-width row of phase cards. */
export function RoadmapSection() {
  return (
    <section className="border-t border-ink/10">
      <Container className="py-16 md:py-24">
        {/* Header: index + label on the left, Korean title on the right */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-display text-sm font-bold tracking-[0.2em] text-plum">
              03
            </span>
            <p className="mt-3 font-display text-xs font-semibold uppercase tracking-[0.22em] text-ink/45">
              ROADMAP
            </p>
          </div>
          <h2 className="text-2xl font-bold text-ink md:text-3xl">
            3개년 성장 로드맵
          </h2>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((item) => (
            <li key={item.phase} className="border-t border-ink/15 pt-5">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-display text-xs font-semibold tracking-widest text-plum">
                  {item.phase}
                </span>
                <span className="font-display text-xs font-semibold tracking-widest text-ink/40">
                  {item.period}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-ink md:text-xl">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
