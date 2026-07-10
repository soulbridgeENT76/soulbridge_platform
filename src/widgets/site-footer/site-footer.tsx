import { Instagram, Youtube, MessageSquare } from "lucide-react";
import { CONTACT, SITE, SOCIALS } from "@shared/config/site";
import { Container } from "@shared/ui";
import { FamilySiteSelect } from "./family-site-select";

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  INSTAGRAM: Instagram,
  YOUTUBE: Youtube,
  KAKAO: MessageSquare,
};

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

        {/* Right: socials + family site */}
        <div className="flex flex-col gap-6 lg:items-end">
          <div className="flex items-center gap-5">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.label] ?? MessageSquare;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="text-paper/70 transition-colors hover:text-paper"
                >
                  <Icon size={20} strokeWidth={1.75} />
                </a>
              );
            })}
          </div>

          <div>
            <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.14em] text-paper/70">
              FAMILY SITE
            </p>
            <FamilySiteSelect />
          </div>
        </div>
      </Container>
    </footer>
  );
}
