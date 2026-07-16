"use client";

import { type FormEvent, useState } from "react";
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
import { cn } from "@shared/lib/cn";

/**
 * Home hero editor — pick a slide (1–5) from the tabs and edit just that one.
 * Each slide saves independently, so there's no long scroll or all-or-nothing
 * submit. The CTA label doubles as the destination page's top eyebrow.
 * TODO(backend): persist the active slide on save.
 */
export function HomeEditor() {
  const [active, setActive] = useState(0);
  const slide = HERO_SLIDES[active];

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO(backend): save ONLY this slide (HERO_SLIDES[active]).
  };

  return (
    <div>
      {/* Slide picker */}
      <div className="flex flex-wrap gap-2">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            aria-current={i === active}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              i === active
                ? "bg-brand text-paper"
                : "border border-ink/15 text-ink/55 hover:border-brand/40 hover:text-brand"
            )}
          >
            {i + 1}화면
          </button>
        ))}
      </div>

      {/* Active slide only. `key` resets the inputs when switching slides. */}
      <form key={slide.id} onSubmit={onSubmit} className="mt-5">
        <section className="rounded-2xl border border-ink/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl font-black leading-none text-brand">
              {String(active + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{active + 1}화면</p>
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
            {active === 0 && (
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

        <AdminFormActions
          cancelHref="/admin"
          submitLabel={`${active + 1}화면 저장`}
        />
      </form>
    </div>
  );
}
