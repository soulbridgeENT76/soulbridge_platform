import { STRATEGY_PILLARS } from "@entities/about";
import { AboutSection } from "./about-section";
import { AboutCards } from "./about-cards";

/** 4 strategic business pillars. */
export function StrategySection() {
  return (
    <AboutSection index="03" eyebrow="STRATEGY" title="4대 전략 비즈니스 필러">
      <AboutCards items={STRATEGY_PILLARS} />
    </AboutSection>
  );
}
