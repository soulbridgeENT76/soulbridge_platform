import { VISION } from "@entities/about";
import { AboutSection } from "./about-section";

/** Closing metric section — the 3-year "TOP 2" goal and key indicators. */
export function VisionSection() {
  return (
    <AboutSection index="05" eyebrow={VISION.eyebrow}>
      {/* Feature metric */}
      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <span className="font-display text-[5.5rem] font-black leading-[0.8] text-plum md:text-[7rem]">
          {VISION.metric}
        </span>
        <h3 className="pb-2 text-3xl font-bold leading-tight text-ink md:text-4xl">
          {VISION.headline}
        </h3>
      </div>

      <p className="mt-8 text-lg font-semibold text-ink md:text-xl">
        {VISION.subhead}
      </p>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/60 md:text-lg">
        {VISION.body}
      </p>

      <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {VISION.points.map((point, i) => (
          <li key={point} className="border-t border-ink/20 pt-5">
            <span className="font-display text-sm font-bold tracking-widest text-plum">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-ink/75 md:text-base">
              {point}
            </p>
          </li>
        ))}
      </ol>
    </AboutSection>
  );
}
