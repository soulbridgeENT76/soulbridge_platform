import Image from "next/image";
import { CONTACT, SITE } from "@shared/config/site";
import { Container, SocialLinks } from "@shared/ui";
import type { SiteBrand, SiteLogo } from "@entities/brand";

// Cache Component: reading the current time is allowed inside `"use cache"`,
// so the copyright year prerenders cleanly (updates on each build/deploy).
async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter({
  logo,
  brand,
}: {
  logo: SiteLogo;
  brand: SiteBrand;
}) {
  const year = await getCurrentYear();
  return (
    <footer className="bg-ink text-paper">
      <Container className="flex flex-col gap-10 py-12 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: brand + legal */}
        <div>
          {/* Same black wordmark, flipped to white for the dark footer. */}
          <Image
            src={logo.src}
            alt={brand.name}
            width={logo.width}
            height={logo.height}
            className="h-12 w-auto brightness-0 invert"
          />

          {/* Company intro sits where the duplicated name line used to be. */}
          <p className="mt-6 text-sm text-paper/50">{brand.intro}</p>
          <p className="mt-2 text-sm text-paper/50">{CONTACT.address}</p>
          <p className="mt-1 text-sm text-paper/50">
            TEL {CONTACT.tel}
            <span className="mx-2 text-paper/25">|</span>
            {CONTACT.email}
          </p>

          <p className="mt-5 font-display text-[11px] uppercase tracking-[0.14em] text-paper/40">
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
