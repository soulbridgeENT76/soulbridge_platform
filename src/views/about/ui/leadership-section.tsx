import { Container, Eyebrow, PlaceholderImage } from "@shared/ui";
import { LEADERSHIP } from "@entities/about";

export function LeadershipSection() {
  return (
    <section className="border-t border-ink/10 py-20 md:py-28">
      <Container>
        <Eyebrow className="text-plum">LEADERSHIP</Eyebrow>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16">
          <PlaceholderImage label="대표 프로필 이미지" ratio="4 / 5" />
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-plum">
              {LEADERSHIP.role}
            </p>
            <h2 className="mt-3 whitespace-pre text-3xl font-bold text-ink md:text-4xl">
              {LEADERSHIP.nameKo}
            </h2>
            <p className="mt-6 max-w-2xl whitespace-pre text-base leading-relaxed text-ink/65">
              {LEADERSHIP.bio}
            </p>
            <ul className="mt-8 space-y-3">
              {LEADERSHIP.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm text-ink/70 md:text-base"
                >
                  <span aria-hidden className="text-plum">
                    —
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
