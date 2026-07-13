import { CONTACT, SITE, SOCIALS } from "@shared/config/site";
import { Container, SocialLinks } from "@shared/ui";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: brand + legal */}
        <div>
          <div className="flex items-baseline gap-4">
            <span className="font-display text-2xl font-black tracking-tight">
              Soul Bridge ENT
            </span>
            <span className="hidden text-sm text-paper/50 sm:inline">
              영혼과 영혼을 잇는 미래 엔터테인먼트
            </span>
          </div>

          <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.12em]">
            SOUL BRIDGE ENT
          </p>
          <p className="mt-2 text-sm text-paper/50">{CONTACT.address}</p>
          <p className="mt-1 text-sm text-paper/50">
            TEL {CONTACT.tel}
            <span className="mx-2 text-paper/25">|</span>
            {CONTACT.email}
          </p>

          <p className="mt-5 font-display text-[11px] uppercase tracking-[0.14em] text-paper/40">
            {SITE.copyright}
            <span className="mx-2 text-paper/20">|</span>
            CREATED BY SOUL BRIDGE ENT
          </p>
        </div>

        {/* Right: socials */}
        <SocialLinks
          items={SOCIALS}
          size={20}
          className="lg:justify-end"
          itemClassName="text-paper/70 hover:text-paper"
        />
      </Container>
    </footer>
  );
}
