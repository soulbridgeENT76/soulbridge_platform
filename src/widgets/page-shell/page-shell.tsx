import type { ReactNode } from "react";
import { SiteHeader } from "@widgets/site-header";
import { SiteFooter } from "@widgets/site-footer";
import { PaperTexture } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { getSiteLogo, getSiteBrand } from "@entities/brand";
import { getVisibleNav, getContactContent } from "@entities/page-content";

type PageShellProps = {
  children: ReactNode;
  /** "overlay" for the home hero (transparent header); "solid" elsewhere. */
  headerVariant?: "overlay" | "solid";
  /** Offset content below the fixed header. Disable for full-bleed heroes. */
  padTop?: boolean;
};

/** Brand-wrapped page frame: header + main + footer on the paper base. */
export async function PageShell({
  children,
  headerVariant = "solid",
  padTop = true,
}: PageShellProps) {
  // All cookie-free and cached, so the shell stays prerenderable: brand under
  // BRAND_TAG (one read for the pair), nav under the page-content tag.
  const [logo, brand, nav, contact] = await Promise.all([
    getSiteLogo(),
    getSiteBrand(),
    getVisibleNav(),
    getContactContent(),
  ]);

  return (
    <div className="relative flex min-h-screen flex-col bg-paper font-sans text-ink">
      <PaperTexture variant="subtle" className="z-0" />
      <SiteHeader
        variant={headerVariant}
        logo={logo}
        brand={brand}
        nav={nav}
        email={contact.email}
      />
      <main className={cn("relative z-10 flex-1", padTop && "pt-24 md:pt-28")}>
        {children}
      </main>
      <div className="relative z-10">
        <SiteFooter logo={logo} brand={brand} contact={contact} />
      </div>
    </div>
  );
}
