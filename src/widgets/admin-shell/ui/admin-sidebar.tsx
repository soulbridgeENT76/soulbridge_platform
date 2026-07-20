"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Sparkles,
  Building2,
  Film,
  Users,
  Newspaper,
  MapPin,
  PanelBottom,
  ExternalLink,
} from "lucide-react";
import { cn } from "@shared/lib/cn";
import { SITE } from "@shared/config/site";

const NAV = [
  { label: "DASHBOARD", href: "/admin", icon: LayoutDashboard },
  { label: "BRAND", href: "/admin/brand", icon: Sparkles },
  { label: "HOME", href: "/admin/home", icon: Home },
  { label: "ABOUT", href: "/admin/about", icon: Building2 },
  { label: "CONTENTS", href: "/admin/contents", icon: Film },
  { label: "ARTISTS", href: "/admin/artists", icon: Users },
  { label: "NOTICE", href: "/admin/notice", icon: Newspaper },
  { label: "CONTACT", href: "/admin/contact", icon: MapPin },
  { label: "FOOTER", href: "/admin/footer", icon: PanelBottom },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-ink text-paper">
      {/* Wordmark — black artwork flipped to white for the dark sidebar. */}
      <Link href="/admin" className="block px-6 py-7" aria-label={SITE.name}>
        <Image
          src={SITE.logo.src}
          alt={SITE.name}
          width={SITE.logo.width}
          height={SITE.logo.height}
          className="h-9 w-auto brightness-0 invert"
        />
        <span className="mt-2.5 block font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-soft">
          Admin
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand text-paper"
                  : "text-paper/60 hover:bg-paper/5 hover:text-paper"
              )}
            >
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer: view live site */}
      <div className="border-t border-paper/10 p-3">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-paper/50 transition-colors hover:bg-paper/5 hover:text-paper"
        >
          사이트 보기
          <ExternalLink size={15} />
        </Link>
      </div>
    </aside>
  );
}
