import Link from "next/link";
import { Film, Users, Newspaper, ArrowRight } from "lucide-react";
import { AdminPageHeader } from "@widgets/admin-shell";
import { getContentsAdmin } from "@entities/content";
import { getArtistsAdmin } from "@entities/artist";
import { getNoticesAdmin } from "@entities/notices";

export default async function AdminDashboardPage() {
  const [artists, contents, news] = await Promise.all([
    getArtistsAdmin(),
    getContentsAdmin(),
    getNoticesAdmin(),
  ]);

  const STATS = [
    {
      label: "콘텐츠",
      href: "/admin/contents",
      count: contents.length,
      icon: Film,
    },
    {
      label: "아티스트",
      href: "/admin/artists",
      count: artists.length,
      icon: Users,
    },
    {
      label: "뉴스",
      href: "/admin/notices",
      count: news.length,
      icon: Newspaper,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="DASHBOARD"
        description="소울브릿지ENT 콘텐츠·아티스트·뉴스를 이곳에서 관리합니다."
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="group rounded-2xl border border-ink/10 bg-white p-6 transition-colors hover:border-brand/40"
            >
              <div className="flex items-center justify-between">
                <Icon size={22} className="text-brand" />
                <ArrowRight
                  size={18}
                  className="text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
                />
              </div>
              <p className="mt-6 text-3xl font-bold text-ink">{stat.count}</p>
              <p className="mt-1 text-sm text-ink/55">{stat.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
