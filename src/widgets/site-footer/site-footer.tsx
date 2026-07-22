import Link from "next/link";
import { SITE } from "@shared/config/site";
import { Container, SocialLinks } from "@shared/ui";
import type { SiteBrand, SiteLogo } from "@entities/brand";
import type { ContactContent } from "@entities/page-content";

// Cache Component: reading the current time is allowed inside `"use cache"`,
// so the copyright year prerenders cleanly (updates on each build/deploy).
async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter({
  logo,
  brand,
  contact,
}: {
  logo: SiteLogo;
  brand: SiteBrand;
  contact: ContactContent;
}) {
  const year = await getCurrentYear();
  return (
    <footer className="bg-ink text-paper">
      <Container className="flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: brand + legal */}
        <div>
          {/* Same black wordmark, flipped to white for the dark footer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.src}
            alt={brand.name}
            width={logo.width}
            height={logo.height}
            className="h-12 w-auto brightness-0 invert"
          />

          {/* Company intro sits where the duplicated name line used to be. */}
          <p className="mt-6 text-sm text-paper/50">{brand.intro}</p>
          <p className="mt-2 text-sm text-paper/50">{contact.address}</p>
          <p className="mt-1 text-sm text-paper/50">
            TEL {contact.tel}
            <span className="mx-2 text-paper/25">|</span>
            {contact.email}
          </p>

          {/* Legal — privacy policy is emphasised per convention. */}
          <div className="mt-5 flex items-center gap-3 text-xs">
            <Link
              href="/privacy"
              className="font-semibold text-paper/75 transition-colors hover:text-paper"
            >
              개인정보 처리방침
            </Link>
            <span aria-hidden className="text-paper/25">
              |
            </span>
            <Link
              href="/terms"
              className="text-paper/55 transition-colors hover:text-paper"
            >
              이용약관
            </Link>
          </div>

          <p className="mt-4 font-display text-[11px] uppercase tracking-[0.14em] text-paper/40">
            © {year} {SITE.copyright}
          </p>
        </div>

        {/* Right: socials */}
        <SocialLinks
          items={brand.socials}
          size={20}
          className="lg:justify-end"
          itemClassName="text-paper/70 hover:text-paper"
        />
      </Container>
    </footer>
  );
}
