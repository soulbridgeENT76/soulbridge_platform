import { type ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminSidebarSlot } from "@widgets/admin-shell/ui/admin-sidebar-slot";
import { Toaster } from "@shared/ui/toast";
import { createClient } from "@/lib/supabase/server";

/**
 * Reads the session and redirects if signed out. Kept as its own component so
 * the cookie access sits inside a <Suspense> boundary — under cacheComponents,
 * awaiting it at the layout's top level would block the whole route.
 *
 * This is the auth check that counts: it runs on the server per request, and
 * getClaims() verifies the JWT signature rather than trusting the cookie.
 * (The proxy redirects too, but as defense in depth, not the source of truth.)
 */
async function AuthGate() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/admin/login");
  return null;
}

/**
 * Admin shell — sidebar + main work area, separate from the public site chrome.
 * Scoped to the `(shell)` group so `/admin/login` renders without it.
 */
export default function AdminShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Suspense>
        <AuthGate />
      </Suspense>
      <Suspense fallback={<div className="w-60 shrink-0 bg-ink" />}>
        <AdminSidebarSlot />
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
      <Toaster />
    </div>
  );
}
