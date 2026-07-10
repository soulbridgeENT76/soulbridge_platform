import { Eyebrow } from "@shared/ui";
import type { RoadmapPhase } from "../model/roadmap";

type RoadmapItemProps = {
  item: RoadmapPhase;
};

/** One phase in the vertical roadmap timeline. */
export function RoadmapItem({ item }: RoadmapItemProps) {
  return (
    <div className="relative border-t border-paper/20 pt-6">
      <Eyebrow className="text-paper/70">
        {item.phase} — {item.period}
      </Eyebrow>
      <h3 className="mt-3 text-2xl font-bold text-paper">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-paper/60">
        {item.description}
      </p>
    </div>
  );
}
