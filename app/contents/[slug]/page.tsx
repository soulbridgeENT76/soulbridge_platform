import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@widgets/page-shell";
import { getContents, getContentByRef } from "@entities/content";
import { ContentDetailView } from "@views/contents";

type Params = { params: Promise<{ slug: string }> };

/**
 * The lineup known at build time. Without params the chrome cannot prerender
 * (SiteHeader reads usePathname, runtime data under cacheComponents). An item
 * added later still renders on demand and is cached under CONTENT_TAG.
 *
 * cacheComponents requires at least one result; the lineup is CMS-managed and
 * may be empty, so an empty one falls back to a sentinel slug that just 404s —
 * returning [] would fail the build.
 */
export async function generateStaticParams() {
  const contents = await getContents();
  if (contents.length === 0) return [{ slug: "none" }];
  // The identifier is the custom slug when set, else the id.
  return contents.map((content) => ({ slug: content.ref }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContentByRef(slug);
  return { title: content ? content.title : "Contents" };
}

export default async function ContentDetailPage({ params }: Params) {
  const { slug } = await params;
  const content = await getContentByRef(slug);
  if (!content) notFound();

  return (
    <PageShell>
      <ContentDetailView content={content} />
    </PageShell>
  );
}
