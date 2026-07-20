"use client";

import type { FormEvent } from "react";
import { showToast } from "@shared/ui/toast";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminFormGrid,
  AdminFormActions,
  AdminReferenceCard,
} from "@widgets/admin-shell";
import { CONTACT, SOCIALS } from "@shared/config/site";
import { PAGE_COPY } from "@shared/config/page-copy";

/**
 * CONTACT page editor — heading copy, contact details, and map location.
 * SNS links are managed on the Brand page.
 * TODO(backend): persist on save.
 */
export function ContactEditor() {
  const copy = PAGE_COPY.contact;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): save contact info.
    showToast("저장되었습니다");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Heading copy */}
      <Card title="페이지 문구" caption="CONTACT 상단에 표시되는 제목·부제목입니다.">
        <AdminField label="제목" htmlFor="title">
          <AdminInput id="title" name="title" defaultValue={copy.title} />
        </AdminField>
        <AdminField label="부제목" htmlFor="subtitle" hint="줄바꿈 그대로 반영">
          <AdminTextarea
            id="subtitle"
            name="subtitle"
            defaultValue={copy.description}
            className="min-h-20"
          />
        </AdminField>
      </Card>

      {/* Contact details */}
      <Card title="연락처 정보">
        <AdminField label="주소" htmlFor="address">
          <AdminInput
            id="address"
            name="address"
            defaultValue={CONTACT.address}
          />
        </AdminField>
        <AdminFormGrid>
          <AdminField label="회사번호" htmlFor="tel">
            <AdminInput id="tel" name="tel" defaultValue={CONTACT.tel} />
          </AdminField>
          <AdminField label="이메일" htmlFor="email">
            <AdminInput
              id="email"
              name="email"
              type="email"
              defaultValue={CONTACT.email}
            />
          </AdminField>
        </AdminFormGrid>
      </Card>

      {/* Socials — managed on the Brand page */}
      <AdminReferenceCard
        title="회사 SNS 링크"
        caption="브랜드 페이지에서 관리하는 SNS가 이 페이지 하단에도 표시됩니다."
        href="/admin/brand"
        hrefLabel="브랜드에서 편집"
        rows={[{ label: "SNS", value: SOCIALS.map((s) => s.label).join(" · ") }]}
      />

      {/* Map — address only; URLs are derived automatically */}
      <Card
        title="지도 위치"
        caption="주소만 입력하면 지도와 네이버·카카오 길찾기 링크가 자동 생성됩니다."
      >
        <AdminField
          label="지도 표시 주소"
          htmlFor="mapAddress"
          hint="이 주소로 구글맵이 표시되고, 네이버·카카오 길찾기 링크가 자동 연결됩니다."
        >
          <AdminInput
            id="mapAddress"
            name="mapAddress"
            defaultValue={CONTACT.mapAddress}
            placeholder="예: 서울특별시 마포구 성암로 330 DMC첨단산업센터"
          />
        </AdminField>
      </Card>

      <AdminFormActions cancelHref="/admin" />
    </form>
  );
}

function Card({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-white p-5">
      <p className="text-sm font-semibold text-ink">{title}</p>
      {caption && <p className="mt-0.5 text-xs text-ink/50">{caption}</p>}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}
