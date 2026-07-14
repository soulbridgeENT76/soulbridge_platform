import { type ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import { AdminSidebar } from "@widgets/admin-shell";

export const metadata: Metadata = {
  title: "Admin · Soul Bridge ENT",
  robots: { index: false, follow: false },
};

/**
 * Admin shell — sidebar + main work area, separate from the public site chrome.
 *
 * NOTE(backend): access control is not wired here yet. To protect this area,
 * add a Supabase session check (see lib/supabase/server.ts) either in this
 * layout or by widening the middleware matcher in proxy.ts to `/admin/:path*`.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Suspense fallback={<div className="w-60 shrink-0 bg-ink" />}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 overflow-x-hidden px-8 py-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          {/* Suspense boundary so pages that read runtime data (e.g. `params`
              in [slug] edit routes) can stream under cacheComponents. */}
          <Suspense fallback={<div className="text-sm text-ink/40">불러오는 중…</div>}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
