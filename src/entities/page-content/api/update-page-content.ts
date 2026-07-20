import { createClient } from "@/lib/supabase/server";

/**
 * Server-only. Deliberately not a server action: "use server" would export
 * these as public HTTP endpoints, so a browser could call them straight past
 * any auth check. The action in the features layer owns that check and calls
 * these — the same split as entities/brand.
 */

export type PageContentRow = {
  slug: string;
  subtitle: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
};

/**
 * Reads one row through the cookie-bearing client — authed and uncached, so a
 * save always merges against the true current row rather than a cached copy.
 * (The public render path uses the cached anon reader instead.)
 */
export async function getPageContent(
  slug: string,
): Promise<PageContentRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("page_contents")
    .select("slug, subtitle, title, description, metadata")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;

  return {
    ...(data as PageContentRow),
    metadata: (data as PageContentRow).metadata ?? {},
  };
}

/** Overwrites the editable columns of one row. `metadata` replaces wholesale,
 *  so callers merge before passing it in. */
export async function updatePageContent(
  slug: string,
  fields: Omit<PageContentRow, "slug">,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("page_contents")
    .update(fields)
    .eq("slug", slug);

  if (error) throw error;
}
