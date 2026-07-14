import { ArrowUpRight } from "lucide-react";
import { AdminLinkButton } from "./admin-button";

type RefRow = { label: string; value: string };

type AdminReferenceCardProps = {
  title: string;
  caption: string;
  /** Admin route where this data is actually edited. */
  href: string;
  hrefLabel: string;
  /** Optional read-only summary rows. */
  rows?: RefRow[];
};

/**
 * Read-only card that points to the single-source screen where a piece of
 * shared data is edited (e.g. SNS links managed on the Brand page).
 */
export function AdminReferenceCard({
  title,
  caption,
  href,
  hrefLabel,
  rows,
}: AdminReferenceCardProps) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-ink/[0.015] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="mt-0.5 text-xs text-ink/50">{caption}</p>
        </div>
        <AdminLinkButton href={href} variant="outline">
          {hrefLabel}
          <ArrowUpRight size={15} />
        </AdminLinkButton>
      </div>

      {rows && rows.length > 0 && (
        <dl className="mt-5 flex flex-col gap-2 text-sm">
          {rows.map((r) => (
            <div key={r.label} className="flex gap-3">
              <dt className="w-16 shrink-0 text-ink/45">{r.label}</dt>
              <dd className="text-ink/80">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
