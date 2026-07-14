"use client";

import type { FormEvent } from "react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminImageUpload,
  AdminFormActions,
} from "@widgets/admin-shell";
import { HERO_SLIDES } from "@widgets/hero-slider/model/slides";
import { SOCIALS } from "@shared/config/site";

/**
 * Home hero editor — one card per full-screen slide.
 * The CTA label doubles as the destination page's top eyebrow.
 * TODO(backend): persist on save.
 */
export function HomeEditor() {
  const socialHref = (label: string) =>
    SOCIALS.find((s) => s.label === label)?.href ?? "";

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

            {/* SNS — first slide only */}
            {i === 0 && (
              <div className="rounded-xl border border-ink/10 p-4">
                <span className="text-sm font-semibold text-ink">SNS 링크</span>
                <p className="mt-0.5 text-xs text-ink/50">
                  첫 화면 하단에 표시됩니다.
                </p>
                <div className="mt-4 flex flex-col gap-4">
                  <AdminField label="인스타그램 (선택)">
                    <AdminInput
                      defaultValue={socialHref("INSTAGRAM")}
                      placeholder="https://instagram.com/..."
                    />
                  </AdminField>
                  <AdminField label="유튜브 (선택)">
                    <AdminInput
                      defaultValue={socialHref("YOUTUBE")}
                      placeholder="https://youtube.com/@..."
                    />
                  </AdminField>
                  <AdminField label="기타 메신저 (선택)">
                    <AdminInput
                      defaultValue={socialHref("MESSENGER")}
                      placeholder="카카오톡·텔레그램 등 링크"
                    />
                  </AdminField>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      <AdminFormActions cancelHref="/admin" />
    </form>
  );
}
