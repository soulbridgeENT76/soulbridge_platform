import { Container, Eyebrow } from "@shared/ui";
import { VISION } from "@entities/about";

export function VisionSection() {
  return (
    <section className="bg-ink py-20 text-paper md:py-28">
      <Container>
        <Eyebrow className="text-mauve">{VISION.eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-3xl whitespace-pre text-3xl font-bold leading-tight md:text-5xl">
          {VISION.headline}
        </h2>
        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-paper/15 bg-paper/15 sm:grid-cols-3">
          {VISION.points.map((point) => (
            <li
              key={point}
              className="bg-ink p-8 text-sm leading-relaxed text-paper/75 md:text-base"
            >
              {point}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
