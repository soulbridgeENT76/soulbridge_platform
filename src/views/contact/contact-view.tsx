import { MapPin } from "lucide-react";
import { PageShell } from "@widgets/page-shell";
import { Container, Eyebrow, SocialLinks } from "@shared/ui";
import { CONTACT, SITE, SOCIALS } from "@shared/config/site";
import { PAGE_COPY } from "@shared/config/page-copy";
import { buildMapLinks } from "@shared/lib/map-links";

export function ContactView() {
  const copy = PAGE_COPY.contact;
  // Map URLs are derived from the address string, not stored.
  const maps = buildMapLinks(CONTACT.mapAddress);
  return (
    <PageShell>
      {/* Top: message + address / socials */}
      <Container className="pb-16 pt-16 md:pt-24">
        <Eyebrow className="text-plum">{copy.eyebrow}</Eyebrow>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-ink md:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink/55 md:text-lg">
          {copy.description}
        </p>

        <div className="mt-14 grid gap-10 border-t border-ink/10 pt-10 sm:grid-cols-2">
          {/* Address */}
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-plum">
              ADDRESS
            </p>
            <p className="mt-4 flex items-start gap-2 text-lg text-ink/80">
              <MapPin size={18} className="mt-1 shrink-0 text-ink/40" />
              {CONTACT.address}
            </p>
            <p className="mt-4 text-sm text-ink/55">
              TEL {CONTACT.tel}
              <span className="mx-2 text-ink/20">·</span>
              {CONTACT.email}
            </p>
          </div>

          {/* Follow */}
          <div className="sm:text-right">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-plum">
              FOLLOW {SITE.name.toUpperCase()}
            </p>
            <SocialLinks
              items={SOCIALS}
              size={20}
              className="mt-4 sm:justify-end"
              itemClassName="text-ink/60 hover:text-ink"
            />
          </div>
        </div>
      </Container>

      {/* Bottom: map */}
      <Container className="pb-24">
        <div className="overflow-hidden rounded-2xl border border-ink/10">
          <iframe
            src={maps.embed}
            title={`${SITE.name} 위치 지도`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[320px] w-full md:h-[440px]"
          />
        </div>
        <div className="mt-4 flex gap-5">
          <a
            href={maps.naver}
            target="_blank"
            rel="noreferrer"
            className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-ink/60 transition-colors hover:text-ink"
          >
            네이버 지도 ↗
          </a>
          <a
            href={maps.kakao}
            target="_blank"
            rel="noreferrer"
            className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-ink/60 transition-colors hover:text-ink"
          >
            카카오맵 ↗
          </a>
        </div>
      </Container>
    </PageShell>
  );
}
