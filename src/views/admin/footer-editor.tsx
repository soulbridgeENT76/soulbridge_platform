"use client";

import type { FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  AdminField,
  AdminInput,
  AdminFormActions,
  AdminLinkButton,
} from "@widgets/admin-shell";
import { CONTACT, SITE, SOCIALS } from "@shared/config/site";

type RefItem = { label: string; value: string };

/**
 * Footer editor. Footer-specific text (company name + one-line intro) is edited
 * here; address / phone / email / SNS are shared with the Contact page, so they
 * are shown read-only with a link to edit them at their single source.
 * TODO(backend): persist on save.
 */
export function FooterEditor() {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): save footer text.
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Footer-specific text */}
      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-sm font-semibold text-ink">저작권 문구</p>
        <p className="mt-0.5 text-xs text-ink/50">푸터 최하단에 표시됩니다.</p>
        <div className="mt-5">
          <AdminField
            label="Copyright"
            htmlFor="copyright"
            hint="© 와 연도(현재 연도 자동)는 앞에 자동으로 붙습니다."
          >
            <AdminInput
              id="copyright"
              name="copyright"
              defaultValue={SITE.copyright}
            />
          </AdminField>
        </div>
      </section>

      {/* Brand (managed on the Brand page) */}
      <ReferenceCard
        title="로고 · 회사명 · 한줄소개"
        caption="브랜드 페이지와 동일한 정보입니다. 한 곳에서만 관리돼요."
        href="/admin/brand"
        hrefLabel="브랜드에서 편집"
        rows={[
          { label: "회사명", value: SITE.name },
          { label: "한줄소개", value: SITE.intro },
        ]}
      />

      {/* Shared info (managed on the Contact page) */}
      <ReferenceCard
        title="주소 · 연락처 · SNS"
        caption="연락처 페이지와 동일한 정보입니다. 한 곳에서만 관리돼요."
        href="/admin/contact"
        hrefLabel="연락처에서 편집"
        rows={[
          { label: "주소", value: CONTACT.address },
          { label: "번호", value: CONTACT.tel },
          { label: "메일", value: CONTACT.email },
          { label: "SNS", value: SOCIALS.map((s) => s.label).join(" · ") },
        ]}
      />

      <AdminFormActions cancelHref="/admin" />
    </form>
  );
}

function ReferenceCard({
  title,
  caption,
  href,
  hrefLabel,
  rows,
}: {
  title: string;
  caption: string;
  href: string;
  hrefLabel: string;
  rows: RefItem[];
}) {
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

      <dl className="mt-5 flex flex-col gap-2 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-3">
            <dt className="w-16 shrink-0 text-ink/45">{r.label}</dt>
            <dd className="text-ink/80">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
