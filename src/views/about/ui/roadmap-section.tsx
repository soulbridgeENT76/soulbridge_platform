import { Container, Eyebrow } from "@shared/ui";
import { ROADMAP, RoadmapItem } from "@entities/roadmap";

export function RoadmapSection() {
  return (
    <section className="bg-plum-deep py-20 text-paper md:py-28">
      <Container>
        <Eyebrow className="text-paper/70">ROADMAP</Eyebrow>
        <h2 className="mt-4 whitespace-pre text-3xl font-bold md:text-4xl">
          3개년 성장 로드맵
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((item) => (
            <RoadmapItem key={item.phase} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
