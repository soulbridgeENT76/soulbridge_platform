import { STRATEGY_PILLARS } from "@entities/about";
import { AboutSection } from "./about-section";

/** 4 strategic business pillars. */
export function StrategySection() {
  return (
    <AboutSection index="03" eyebrow="STRATEGY" title="4대 전략 비즈니스 필러">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STRATEGY_PILLARS.map((pillar) => (
          <div key={pillar.no} className="border-t border-ink/15 pt-5">
            <span className="font-display text-xs font-semibold tracking-widest text-plum">
              {pillar.no}
            </span>
            <h3 className="mt-3 text-lg font-bold text-ink">{pillar.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </AboutSection>
  );
}
