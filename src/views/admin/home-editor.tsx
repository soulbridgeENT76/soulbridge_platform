"use client";

import type { FormEvent } from "react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminImageUpload,
  AdminFormActions,
  AdminReferenceCard,
} from "@widgets/admin-shell";
import { HERO_SLIDES } from "@widgets/hero-slider/model/slides";
import { SOCIALS } from "@shared/config/site";

/**
 * Home hero editor — one card per full-screen slide.
 * The CTA label doubles as the destination page's top eyebrow.
 * TODO(backend): persist on save.
 */
export function HomeEditor() {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): collect all slide values and save.
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {HERO_SLIDES.map((slide, i) => (
        <section
          key={slide.id}
          className="rounded-2xl border border-ink/10 bg-white p-5"
        >
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-black leading-none text-brand">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{i + 1}화면</p>
              <p className="mt-0.5 text-xs text-ink/50">이동: {slide.cta.href}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            <AdminField label="배너 이미지" hint="가로형 16:9 이미지">
              <AdminImageUpload ratio="16 / 9" />
            </AdminField>

            <AdminField label="영문 소제목" hint="상단 작은 영문 라벨">
              <AdminInput defaultValue={slide.eyebrow} className="max-w-md" />
            </AdminField>

            <AdminField label="대제목" hint="줄바꿈 그대로 반영">
              <AdminTextarea defaultValue={slide.titleKo} className="min-h-20" />
            </AdminField>

            <AdminField label="소제목" hint="줄바꿈 그대로 반영">
              <AdminTextarea defaultValue={slide.body} />
            </AdminField>

            <AdminField
              label="페이지 이동 버튼 문구"
              hint="이동할 페이지 상단의 영문 라벨(예: OUR STORY)에도 동일하게 적용됩니다."
            >
              <AdminInput defaultValue={slide.cta.label} className="max-w-md" />
            </AdminField>

            {/* SNS — first slide only; managed on the Brand page */}
            {i === 0 && (
              <AdminReferenceCard
                title="SNS 링크"
                caption="첫 화면 하단에 표시됩니다. 브랜드 페이지에서 관리해요."
                href="/admin/brand"
                hrefLabel="브랜드에서 편집"
                rows={[
                  { label: "SNS", value: SOCIALS.map((s) => s.label).join(" · ") },
                ]}
              />
            )}
          </div>
        </section>
      ))}

      <AdminFormActions cancelHref="/admin" />
    </form>
  );
}
