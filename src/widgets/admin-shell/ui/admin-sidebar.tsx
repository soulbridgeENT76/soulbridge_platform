"use client";

import Link from "next/link";
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

const NAV = [
  { label: "대시보드", href: "/admin", icon: LayoutDashboard },
  { label: "브랜드", href: "/admin/brand", icon: Sparkles },
  { label: "홈", href: "/admin/home", icon: Home },
  { label: "회사소개", href: "/admin/about", icon: Building2 },
  { label: "콘텐츠", href: "/admin/contents", icon: Film },
  { label: "아티스트", href: "/admin/artists", icon: Users },
  { label: "뉴스", href: "/admin/news", icon: Newspaper },
  { label: "연락처", href: "/admin/contact", icon: MapPin },
  { label: "푸터", href: "/admin/footer", icon: PanelBottom },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-ink text-paper">
      {/* Wordmark */}
      <Link href="/admin" className="block px-6 py-7">
        <span className="font-display text-lg font-black leading-[0.9] tracking-tight">
          Soul Bridge
        </span>
        <span className="mt-1 block font-display text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-soft">
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
