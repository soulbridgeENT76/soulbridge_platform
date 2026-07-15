"use client";

import type { FormEvent } from "react";
import {
  AdminField,
  AdminInput,
  AdminImageUpload,
  AdminFormActions,
} from "@widgets/admin-shell";
import { SITE, SOCIALS } from "@shared/config/site";

/**
 * Brand editor — global identity used across the header, footer, and metadata.
 * TODO(backend): persist on save. Deleting the logo falls back to the text
 * wordmark ({SITE.name}).
 */
export function BrandEditor() {
  const socialHref = (label: string) =>
    SOCIALS.find((s) => s.label === label)?.href ?? "";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): save logo + brand text + socials.
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-sm font-semibold text-ink">로고</p>
        <p className="mt-0.5 text-xs text-ink/50">
          헤더·푸터에 사용됩니다. PNG/SVG(배경 투명) 권장. 삭제하면 텍스트 로고
          “{SITE.name}”로 표시됩니다.
        </p>
        <div className="mt-5">
          <AdminImageUpload
            ratio="5 / 2"
            fit="contain"
            name="logo"
            className="max-w-xs"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-sm font-semibold text-ink">브랜드 문구</p>
        <p className="mt-0.5 text-xs text-ink/50">
          로고 대체 텍스트와 푸터 소개에 사용됩니다.
        </p>
        <div className="mt-5 flex flex-col gap-5">
          <AdminField label="회사명" htmlFor="name">
            <AdminInput
              id="name"
              name="name"
              defaultValue={SITE.name}
              className="max-w-sm"
            />
          </AdminField>
          <AdminField label="회사 한줄소개" htmlFor="intro">
            <AdminInput id="intro" name="intro" defaultValue={SITE.intro} />
          </AdminField>
        </div>
      </section>

      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-sm font-semibold text-ink">회사 SNS 링크</p>
        <p className="mt-0.5 text-xs text-ink/50">
          선택 입력 · 헤더·푸터·홈·연락처에 공통으로 표시됩니다.
        </p>
        <div className="mt-5 flex flex-col gap-5">
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
        </div>
      </section>

      <AdminFormActions cancelHref="/admin" />
    </form>
  );
}
