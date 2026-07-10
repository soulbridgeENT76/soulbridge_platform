import { PageShell } from "@widgets/page-shell";
import { Container, PageHeading, PlaceholderImage } from "@shared/ui";
import { CONTACT, SOCIALS } from "@shared/config/site";

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-t border-ink/10 py-5 sm:flex-row sm:gap-8">
      <dt className="w-28 shrink-0 font-display text-xs font-semibold uppercase tracking-[0.18em] text-plum">
        {label}
      </dt>
      <dd className="text-base text-ink/80">{children}</dd>
    </div>
  );
}

export function ContactView() {
  return (
    <PageShell>
      <PageHeading eyebrow="CONTACT" title="찾아오시는 길" description={CONTACT.email} />
      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <dl>
            <InfoRow label="ADDRESS">{CONTACT.address}</InfoRow>
            <InfoRow label="TEL">{CONTACT.tel}</InfoRow>
            <InfoRow label="HOURS">{CONTACT.hours}</InfoRow>
            <InfoRow label="SOCIAL">
              <span className="flex flex-wrap gap-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="font-display text-xs font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-60"
                  >
                    {s.label} ↗
                  </a>
                ))}
              </span>
            </InfoRow>
            <p className="mt-8 text-sm leading-relaxed text-ink/55">
              {CONTACT.directions}
            </p>
          </dl>

          <div>
            <PlaceholderImage label="지도 이미지 (네이버 / 카카오맵)" ratio="4 / 3" />
            <div className="mt-4 flex gap-4">
              <a
                href={CONTACT.maps.naver}
                className="font-display text-xs font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-60"
              >
                네이버 지도 ↗
              </a>
              <a
                href={CONTACT.maps.kakao}
                className="font-display text-xs font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-60"
              >
                카카오맵 ↗
              </a>
            </div>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
