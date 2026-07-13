import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageShell } from "@widgets/page-shell";
import { Container, PlaceholderImage } from "@shared/ui";
import type { Artist } from "@entities/artist";

type ArtistDetailViewProps = {
  artist: Artist;
};

export function ArtistDetailView({ artist }: ArtistDetailViewProps) {
  return (
    <PageShell>
      <Container className="pb-24 pt-16 md:pt-24">
        <div className="mx-auto max-w-5xl">
          {/* Back to list */}
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.15em] text-ink/45 transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} />
            아티스트 목록
          </Link>

          {/* Profile: image left, intro right */}
          <div className="mt-10 grid gap-8 sm:grid-cols-[minmax(0,17rem)_1fr] sm:gap-12">
            <PlaceholderImage
              label={`${artist.nameKo} · 프로필`}
              ratio="3 / 4"
            />

            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-plum">
                {artist.role}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink md:text-5xl">
                {artist.nameKo}
              </h1>
              <p className="mt-2 font-display text-sm font-medium uppercase tracking-[0.18em] text-ink/45">
                {artist.nameEn}
              </p>

              {artist.bio && (
                <p className="mt-7 whitespace-pre-line text-base leading-relaxed text-ink/70">
                  {artist.bio}
                </p>
              )}

              {artist.socials && artist.socials.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink/10 pt-6">
                  {artist.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-[0.15em] text-ink/60 transition-colors hover:text-ink"
                    >
                      {social.label}
                      <ArrowUpRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Works */}
          {artist.works && artist.works.length > 0 && (
            <section className="mt-16 border-t border-ink/10 pt-10">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-plum">
                WORKS
              </p>
              <h2 className="mt-3 text-2xl font-bold text-ink">작품활동</h2>

              <ul className="mt-8 flex flex-col divide-y divide-ink/10">
                {artist.works.map((work) => (
                  <li
                    key={`${work.year}-${work.title}`}
                    className="flex flex-wrap items-baseline gap-x-5 gap-y-1 py-4"
                  >
                    <span className="w-24 shrink-0 font-display text-sm font-semibold tracking-wide text-ink/45">
                      {work.year}
                    </span>
                    <span className="flex-1 text-base font-semibold text-ink">
                      {work.title}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Container>
    </PageShell>
  );
}
