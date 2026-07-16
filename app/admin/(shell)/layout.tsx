import { type ReactNode, Suspense } from "react";
import { AdminSidebar } from "@widgets/admin-shell";

/**
 * Admin shell — sidebar + main work area, separate from the public site chrome.
 * Scoped to the `(shell)` group so `/admin/login` renders without it.
 *
 * NOTE(backend): access control is not wired here yet. To protect this area,
 * add a Supabase session check (see lib/supabase/server.ts) here and redirect
 * to /admin/login, or widen the middleware matcher in proxy.ts to
 * `/admin/:path*` while excluding the login route.
 */
export default function AdminShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
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
