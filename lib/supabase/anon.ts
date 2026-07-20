import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cookie-free anon client, for reads that happen on the render path.
 *
 * Deliberately NOT the @supabase/ssr server client from ./server: that one
 * awaits cookies(), which is illegal inside a `"use cache"` scope and — under
 * cacheComponents — would opt every page that touches it out of prerendering.
 *
 * Only valid for tables with a public `anon` select policy (today: site_settings).
 * Anything user-scoped or write-shaped must go through ./server so RLS sees the
 * signed-in user.
 */
export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
