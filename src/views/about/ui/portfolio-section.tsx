import { PORTFOLIO } from "@entities/about";
import { AboutSection } from "./about-section";

/** Diversified business portfolio — two focus areas. */
export function PortfolioSection() {
  return (
    <AboutSection index="02" eyebrow="PORTFOLIO" title="주요 사업 포트폴리오 다각화" tinted>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        {PORTFOLIO.map((area, i) => (
          <div key={area.title} className="border-t border-ink/15 pt-5">
            <span className="font-display text-xs font-semibold tracking-widest text-plum">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-bold text-ink">{area.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              {area.body}
            </p>
            <ul className="mt-5 flex flex-col gap-2 border-t border-ink/10 pt-5">
              {area.points.map((point) => (
                <li key={point} className="text-sm text-plum">
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
