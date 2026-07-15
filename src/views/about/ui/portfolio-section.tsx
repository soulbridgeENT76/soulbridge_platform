import { PORTFOLIO } from "@entities/about";
import { AboutSection } from "./about-section";
import { AboutCards } from "./about-cards";

/** Diversified business portfolio. */
export function PortfolioSection() {
  return (
    <AboutSection index="02" eyebrow="PORTFOLIO" title="주요 사업 포트폴리오 다각화" tinted>
      <AboutCards items={PORTFOLIO} />
    </AboutSection>
  );
}
