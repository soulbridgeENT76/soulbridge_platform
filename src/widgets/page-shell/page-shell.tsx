import type { ReactNode } from "react";
import { SiteHeader } from "@widgets/site-header";
import { SiteFooter } from "@widgets/site-footer";
import { PaperTexture } from "@shared/ui";
import { cn } from "@shared/lib/cn";

type PageShellProps = {
  children: ReactNode;
  /** "overlay" for the home hero (transparent header); "solid" elsewhere. */
  headerVariant?: "overlay" | "solid";
  /** Offset content below the fixed header. Disable for full-bleed heroes. */
  padTop?: boolean;
};

/** Brand-wrapped page frame: header + main + footer on the paper base. */
export function PageShell({
  children,
  headerVariant = "solid",
  padTop = true,
}: PageShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-paper font-sans text-ink">
      <PaperTexture variant="subtle" className="z-0" />
      <SiteHeader variant={headerVariant} />
      <main className={cn("relative z-10 flex-1", padTop && "pt-24 md:pt-28")}>
        {children}
      </main>
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
}
