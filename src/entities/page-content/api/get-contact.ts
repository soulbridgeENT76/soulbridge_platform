import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/anon";
import { createClient } from "@/lib/supabase/server";
import { CONTACT } from "@shared/config/site";
import { PAGE_COPY } from "@shared/config/page-copy";
import { PAGE_CONTENT_TAG } from "./tags";

/**
 * Everything the CONTACT page renders: the heading copy (from the row's
 * columns) plus the contact details (from its metadata). One shape so the
 * public page and the admin editor read the same thing.
 */
export type ContactContent = {
  eyebrow: string;
  title: string;
  description: string;
  address: string;
  tel: string;
  email: string;
  /** Searchable address the map + directions links are derived from. */
  mapAddress: string;
};

const str = (v: unknown): string => (typeof v === "string" ? v : "");

/**
 * Shapes a contact row, substituting the bundled defaults for any blank field.
 * Blank is treated as unset — an operator who never filled the address should
 * see the placeholder, and the map needs *some* address to build its links.
 */
function shape(row: {
  subtitle: string | null;
  title: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
}): ContactContent {
  const meta = row.metadata ?? {};
  return {
    eyebrow: str(row.subtitle) || PAGE_COPY.contact.eyebrow,
    title: str(row.title) || PAGE_COPY.contact.title,
    description: str(row.description) || (PAGE_COPY.contact.description ?? ""),
    address: str(meta.address) || CONTACT.address,
    tel: str(meta.tel) || CONTACT.tel,
    email: str(meta.email) || CONTACT.email,
    mapAddress: str(meta.mapAddress) || CONTACT.mapAddress,
  };
}

/** The bundled defaults, for a missing row or an unreachable database. */
const FALLBACK: ContactContent = {
  eyebrow: PAGE_COPY.contact.eyebrow,
  title: PAGE_COPY.contact.title,
  description: PAGE_COPY.contact.description ?? "",
  address: CONTACT.address,
  tel: CONTACT.tel,
  email: CONTACT.email,
  mapAddress: CONTACT.mapAddress,
};

const SELECT = "subtitle, title, description, metadata" as const;

/**
 * Public read for the render path. Cookie-free and cached under the shared
 * page-content tag, invalidated when the admin saves.
 */
export async function getContactContent(): Promise<ContactContent> {
  "use cache";
  cacheTag(PAGE_CONTENT_TAG);
  cacheLife("hours");

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from("page_contents")
      .select(SELECT)
      .eq("slug", "contact")
      .single();
    if (error || !data) return FALLBACK;
    return shape(data);
  } catch {
    return FALLBACK;
  }
}

/** Authed, uncached read for the admin editor — never a stale prefill. */
export async function getContactAdmin(): Promise<ContactContent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_contents")
    .select(SELECT)
    .eq("slug", "contact")
    .single();
  if (error || !data) return FALLBACK;
  return shape(data);
}
