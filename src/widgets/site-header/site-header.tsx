"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV, SOCIALS, CONTACT } from "@shared/config/site";
import { Container, SocialLinks } from "@shared/ui";
import { cn } from "@shared/lib/cn";

type SiteHeaderProps = {
  /**
   * "overlay" sits transparently over the light hero and turns solid on
   * scroll. "solid" is always the paper bar (used on interior pages).
   */
  variant?: "overlay" | "solid";
};

export function SiteHeader({ variant = "solid" }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll and close on Escape while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Transparent only while at the top of an overlay-mode page (the light hero).
  const transparent = variant === "overlay" && !scrolled && !menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 text-ink transition-colors duration-300",
          transparent
            ? "bg-transparent"
            : "border-b border-ink/10 bg-paper/90 backdrop-blur-sm"
        )}
      >
        <Container className="relative flex h-24 max-w-none items-center justify-between md:h-28">
          {/* Stacked wordmark logo */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="font-display text-2xl font-black leading-[0.85] tracking-tight md:text-[1.7rem]"
          >
            <span className="block">Soul</span>
            <span className="block">Bridge</span>
            <span className="block text-[0.55em] font-bold tracking-[0.35em]">
              ENT
            </span>
          </Link>

          {/* Center nav (desktop) */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex lg:gap-14">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-display text-sm font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-60",
                    active && "underline decoration-1 underline-offset-8"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Circular menu toggle (all sizes) */}
          <button
            type="button"
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper transition-transform hover:scale-105"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </Container>
      </header>

      {/* Backdrop */}
      <div
        aria-hidden
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-ink/50 backdrop-blur-xs transition-opacity duration-300",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Right slide-out drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[80vw] max-w-[360px] flex-col bg-ink text-paper transition-transform duration-500 ease-out",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-24 items-center justify-between px-7 md:h-28">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-paper/40">
            MENU
          </span>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col px-7">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "group flex items-center justify-between border-t border-paper/10 py-4 transition-colors",
                  active ? "text-paper" : "text-paper/60 hover:text-paper"
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-4 w-px bg-paper transition-opacity",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="font-display text-lg font-semibold uppercase tracking-[0.12em]">
                    {item.label}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-60"
                />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-paper/10 px-7 py-7">
          <SocialLinks
            items={SOCIALS}
            size={20}
            itemClassName="text-paper/50 hover:text-paper"
          />
          <p className="mt-5 text-[13px] tracking-wide text-paper/40">
            {CONTACT.email}
          </p>
        </div>
      </aside>
    </>
  );
}
