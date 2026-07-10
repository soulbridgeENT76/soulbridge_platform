import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading } from "@shared/ui";
import { ABOUT } from "@entities/about";
import { LeadershipSection } from "./ui/leadership-section";
import { RoadmapSection } from "./ui/roadmap-section";
import { VisionSection } from "./ui/vision-section";

export function AboutView() {
  return (
    <PageShell>
      <PageHeading eyebrow={ABOUT.eyebrow} title={ABOUT.title} />
      <Container className="pb-20 pt-8 md:pb-28">
        <p className="max-w-3xl whitespace-pre text-lg leading-relaxed text-ink/70 md:text-xl">
          {ABOUT.body}
        </p>
      </Container>
      <LeadershipSection />
      <RoadmapSection />
      <VisionSection />
    </PageShell>
  );
}
