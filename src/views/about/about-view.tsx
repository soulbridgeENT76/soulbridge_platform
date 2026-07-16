import { PageShell } from "@widgets/page-shell";
import { Container, Eyebrow } from "@shared/ui";
import { ABOUT } from "@entities/about";
import { LeadershipSection } from "./ui/leadership-section";
import { PortfolioSection } from "./ui/portfolio-section";
import { StrategySection } from "./ui/strategy-section";

export function AboutView() {
  return (
    <PageShell>
      {/* Left-aligned hero */}
      <Container className="pb-10 pt-16 md:pb-14 md:pt-24">
        <Eyebrow className="text-plum">{ABOUT.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-4xl whitespace-pre-line text-3xl/[1.25] font-bold tracking-tight text-ink md:text-4xl/[1.25] lg:text-5xl/[1.25]">
          {ABOUT.title}
        </h1>
        <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed text-ink/60 md:text-lg">
          {ABOUT.body}
        </p>
      </Container>

      <LeadershipSection />
      <PortfolioSection />
      <StrategySection />
    </PageShell>
  );
}
