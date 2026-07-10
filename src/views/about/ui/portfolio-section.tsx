import { PORTFOLIO } from "@entities/about";
import { AboutSection } from "./about-section";

/** Diversified business portfolio — two focus areas. */
export function PortfolioSection() {
  return (
    <AboutSection index="03" eyebrow="PORTFOLIO" title="주요 사업 포트폴리오 다각화">
      <div className="flex flex-col divide-y divide-ink/10">
        {PORTFOLIO.map((area, i) => (
          <div key={area.title} className={i === 0 ? "pb-10" : "pt-10"}>
            <h3 className="text-xl font-bold text-ink md:text-2xl">
              {area.title}
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/65">
              {area.body}
            </p>
            <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
              {area.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm text-ink/75 md:text-base"
                >
                  <span aria-hidden className="text-plum">
                    →
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </AboutSection>
  );
}
