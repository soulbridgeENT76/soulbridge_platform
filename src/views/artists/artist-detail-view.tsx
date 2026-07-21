import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Container, PlaceholderImage, SocialLinks } from "@shared/ui";
import { PORTRAIT_RATIO, UPLOAD_SIZE } from "@shared/config/media";
import type { Artist } from "@entities/artist";

type ArtistDetailViewProps = {
  artist: Artist;
};

/**
 * Content only — the page owns PageShell so the chrome can prerender while
 * this streams in behind a Suspense boundary. The slug is runtime data, and
 * under cacheComponents awaiting it above the shell would block the whole page.
 */
export function ArtistDetailView({ artist }: ArtistDetailViewProps) {
  return (
    <Container className="pb-24 pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl">
          {/* Profile: image left, intro right */}
          {/* Image column matches the About → Leadership profile (18rem). */}
          <div className="grid gap-8 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-12">
            {artist.photo ? (
              <Image
                src={artist.photo}
                alt={`${artist.nameKo} · 프로필`}
                width={UPLOAD_SIZE.portrait.width}
                height={UPLOAD_SIZE.portrait.height}
                sizes="(min-width: 640px) 18rem, 100vw"
                priority
                className="h-auto w-full rounded-lg object-cover"
              />
            ) : (
              <PlaceholderImage
                label={`${artist.nameKo} · 프로필`}
                ratio={PORTRAIT_RATIO}
              />
            )}

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

              {artist.socials.length > 0 && (
                <SocialLinks
                  items={artist.socials}
                  size={20}
                  className="mt-8 border-t border-ink/10 pt-6"
                  itemClassName="text-ink/50 hover:text-ink"
                />
              )}
            </div>
          </div>

          {/* Works */}
          {artist.works.length > 0 && (
            <section className="mt-16 border-t border-ink/10 pt-10">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-plum">
                CAREER
              </p>
              <h2 className="mt-3 text-2xl font-bold text-ink">활동 이력</h2>

              <ul className="mt-8 flex flex-col divide-y divide-ink/10">
                {artist.works.map((work, i) => (
                  <li
                    key={`${work.label}-${work.description}-${i}`}
                    className="flex flex-wrap items-baseline gap-x-5 gap-y-1 py-4"
                  >
                    <span className="w-24 shrink-0 font-display text-sm font-semibold tracking-wide text-ink/45">
                      {work.label}
                    </span>
                    <span className="flex-1 text-base font-semibold text-ink">
                      {work.description}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Back-to-list CTA */}
          <div className="mt-16 flex justify-center border-t border-ink/10 pt-14">
            <Link
              href="/artists"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-8 py-4 font-display text-sm font-semibold uppercase tracking-[0.15em] text-paper transition-transform hover:scale-[1.03]"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              BACK TO ARTISTS
            </Link>
          </div>
      </div>
    </Container>
  );
}
