"use client";

import type { FormEvent } from "react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminFormGrid,
  AdminFormActions,
} from "@widgets/admin-shell";
import { CONTACT, SOCIALS } from "@shared/config/site";
import { PAGE_COPY } from "@shared/config/page-copy";

/**
 * CONTACT page editor — heading copy, contact details, socials, and map links.
 * TODO(backend): persist on save.
 */
export function ContactEditor() {
  const copy = PAGE_COPY.contact;
  const socialHref = (label: string) =>
    SOCIALS.find((s) => s.label === label)?.href ?? "";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): save contact info.
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

      {/* Socials */}
      <Card title="SNS" caption="선택 입력 · 비우면 표시되지 않습니다.">
        <AdminField label="인스타그램 (선택)" htmlFor="instagram">
          <AdminInput
            id="instagram"
            name="instagram"
            defaultValue={socialHref("INSTAGRAM")}
            placeholder="https://instagram.com/..."
          />
        </AdminField>
        <AdminField label="유튜브 (선택)" htmlFor="youtube">
          <AdminInput
            id="youtube"
            name="youtube"
            defaultValue={socialHref("YOUTUBE")}
            placeholder="https://youtube.com/@..."
          />
        </AdminField>
        <AdminField label="기타 메신저 (선택)" htmlFor="messenger">
          <AdminInput
            id="messenger"
            name="messenger"
            defaultValue={socialHref("MESSENGER")}
            placeholder="카카오톡·텔레그램 등 링크"
          />
        </AdminField>
      </Card>

      {/* Map — address only; URLs are derived automatically */}
      <Card
        title="지도 위치"
        caption="주소만 입력하면 지도와 네이버·카카오 길찾기 링크가 자동 생성됩니다."
      >
        <AdminField
          label="지도 표시 주소"
          htmlFor="mapAddress"
          hint="이 주소로 구글맵이 표시되고, 네이버·카카오 길찾기 링크가 자동 연결됩니다. (표기용 주소와 달라도 됩니다)"
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
