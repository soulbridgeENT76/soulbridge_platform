"use client";

import { useActionState, useState } from "react";
import { TriangleAlert } from "lucide-react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminImageUpload,
  AdminFormActions,
  AdminReferenceCard,
} from "@widgets/admin-shell";
import { LANDSCAPE_RATIO, UPLOAD_SIZE } from "@shared/config/media";
import { cn } from "@shared/lib/cn";
import { WEBP_QUALITY_PHOTO } from "@shared/lib/image-to-webp";
import { useSaveToast } from "@shared/ui/use-save-toast";
import type { HomeSlide } from "@entities/page-content";
import { saveHomeSlide } from "@features/update-home-slide";

/**
 * Home hero editor — pick a slide from the tabs and edit just that one. Each
 * slide saves independently, so there's no long scroll or all-or-nothing
 * submit. The CTA label doubles as the destination page's top eyebrow.
 *
 * Slides come from page_contents, the same source the public home reads, so
 * this screen and the site can never drift apart.
 * TODO(backend): persist the active slide on save.
 */
export function HomeEditor({
  slides,
  socialsSummary,
}: {
  slides: HomeSlide[];
  socialsSummary: string;
}) {
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const [state, formAction, isPending] = useActionState(saveHomeSlide, {
    ok: true,
  });
  // Each slide saves on its own, and the page does not navigate afterwards —
  // without this the operator gets no sign the write landed.
  useSaveToast(state, isPending);

  if (!slide) {
    return (
      <p className="text-sm text-ink/50">
        등록된 홈 화면이 없습니다. 기본 데이터 마이그레이션이 적용됐는지
        확인해주세요.
      </p>
    );
  }

  return (
    <div>
      {/* Slide picker */}
      <div className="flex flex-wrap gap-2">
        {slides.map((s, i) => (
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
      {/* `key` resets the inputs when switching slides; the hidden slug tells
          the action which row to write, since only one slide is submitted. */}
      <form key={slide.id} action={formAction} className="mt-5">
        <input type="hidden" name="slug" value={slide.slug} />
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
            {/* Desktop + mobile banners are two separate compositions, so they
                sit side by side. Widths are picked so both boxes end up the
                same height (24rem ÷ 16:9 ≈ 7.6rem ÷ 9:16 ≈ 13.5rem). */}
            <div>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                {/* Any upload is cropped to the banner ratio and resized to the
                    fixed size via `output`, then re-encoded to WebP — the only
                    type the bucket accepts. A 2560px photo shrinks a lot at 0.85. */}
                <AdminField
                  label="배너 이미지 (데스크톱)"
                  hint="가로형 16:9로 자동 조정 · 권장 2560 × 1440"
                >
                  <AdminImageUpload
                    ratio={LANDSCAPE_RATIO}
                    name="bannerDesktop"
                    initialUrl={slide.banner.desktop}
                    recommendedSize={UPLOAD_SIZE.bannerDesktop}
                    output={{ ...UPLOAD_SIZE.bannerDesktop, fit: "cover" }}
                    outputQuality={WEBP_QUALITY_PHOTO}
                    className="w-full sm:w-96"
                  />
                </AdminField>

                <AdminField
                  label="모바일"
                  hint="세로형 9:16로 자동 조정 · 권장 1440 × 2560"
                >
                  <AdminImageUpload
                    ratio="9 / 16"
                    name="bannerMobile"
                    initialUrl={slide.banner.mobile}
                    recommendedSize={UPLOAD_SIZE.bannerMobile}
                    output={{ ...UPLOAD_SIZE.bannerMobile, fit: "cover" }}
                    outputQuality={WEBP_QUALITY_PHOTO}
                    className="w-40 sm:w-[7.6rem]"
                  />
                </AdminField>
              </div>

              <p className="mt-5 border-t border-ink/[0.07] pt-4 text-xs text-ink/45">
                ※ 모바일 배너는 데스크톱을 자른 게 아니라 세로 구도로 새로 잡은
                이미지여야 합니다.
              </p>
            </div>

            <AdminField label="영문 소제목" hint="상단 작은 영문 라벨">
              <AdminInput
                name="eyebrow"
                defaultValue={slide.eyebrow}
                className="max-w-md"
              />
            </AdminField>

            <AdminField label="대제목" hint="줄바꿈 그대로 반영">
              <AdminTextarea
                name="title"
                defaultValue={slide.titleKo}
                className="min-h-20"
              />
            </AdminField>

            <AdminField label="소제목" hint="줄바꿈 그대로 반영">
              {/* The news slide renders a headline list instead of body copy,
                  so its `body` is null — show an empty box, not "null". */}
              <AdminTextarea name="body" defaultValue={slide.body ?? ""} />
            </AdminField>

            <AdminField
              label="페이지 이동 버튼 문구"
              hint="이동할 페이지 상단의 영문 라벨(예: OUR STORY)에도 동일하게 적용됩니다."
            >
              <AdminInput
                name="ctaLabel"
                defaultValue={slide.cta.label}
                className="max-w-md"
              />
            </AdminField>

            {/* SNS — first slide only; managed on the Brand page */}
            {active === 0 && (
              <AdminReferenceCard
                title="SNS 링크"
                caption="첫 화면 하단에 표시됩니다. 브랜드 페이지에서 관리해요."
                href="/admin/brand"
                hrefLabel="브랜드에서 편집"
                rows={[
                  { label: "SNS", value: socialsSummary },
                ]}
              />
            )}
          </div>
        </section>

        {/* Uploads fail for reasons the operator can act on (file too large,
            network dropped), so the action reports them instead of throwing. */}
        {state.error && (
          <p className="mt-5 flex items-start gap-1.5 text-sm text-red-600">
            <TriangleAlert size={15} className="mt-0.5 shrink-0" />
            {state.error}
          </p>
        )}

        <AdminFormActions
          cancelHref="/admin"
          submitLabel={`${active + 1}화면 저장`}
        />
      </form>
    </div>
  );
}
