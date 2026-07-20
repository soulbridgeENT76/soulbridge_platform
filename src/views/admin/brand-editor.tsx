"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { showToast } from "@shared/ui/toast";
import {
  AdminField,
  AdminInput,
  AdminImageUpload,
  AdminFormActions,
} from "@widgets/admin-shell";
import { LOGO_MIN_HEIGHT, LOGO_OUTPUT_HEIGHT } from "@shared/config/media";
import { SITE } from "@shared/config/site";
import { mediaUrl } from "@shared/lib/media-url";
import { type BrandSettings } from "@entities/brand";
import { saveBrand } from "@/src/features/update-brand";

interface BrandEditorProps {
  initial: BrandSettings;
}

export function BrandEditor({ initial }: BrandEditorProps) {
  const [brandName, setBrandName] = useState(initial.brand.name);
  const [brandInfo, setBrandInfo] = useState(initial.brand.intro);
  const [state, formAction] = useActionState(saveBrand, { ok: true });

  // Toast only after a real save. `useActionState` returns a brand-new object
  // each time the action resolves, so a change of identity from the initial
  // value means the server actually responded. Comparing against the captured
  // initial (rather than a first-render flag) also stays correct under React
  // StrictMode's double-mount, which would otherwise fire a toast on load.
  const initialState = useRef(state);
  useEffect(() => {
    if (state === initialState.current) return;
    if (state.ok && !state.error) showToast("저장되었습니다");
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-sm font-semibold text-ink">로고</p>
        <p className="mt-0.5 text-xs text-ink/50">
          헤더·푸터·메뉴에 사용됩니다. 제거하면 기본 로고로 돌아갑니다.
        </p>

        {/* Padding is THE cause of an undersized logo — call it out loudest. */}
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-brand/30 bg-brand/[0.06] px-3 py-2.5">
          <TriangleAlert size={15} className="mt-0.5 shrink-0 text-brand" />
          <div>
            <p className="text-xs font-bold text-ink">
              로고 주변 여백(빈 공간)을 꼭 없애 주세요
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
              로고가{" "}
              <b className="font-semibold text-ink/80">
                캔버스 상·하·좌·우 끝에 딱 닿도록
              </b>{" "}
              꽉 차게 잘라 주세요. 위아래에 투명 여백이 있으면 그만큼 사이트에서{" "}
              <b className="font-semibold text-ink/80">작게 표시됩니다.</b>
            </p>
          </div>
        </div>

        <ul className="mt-3 flex flex-col gap-1 text-xs text-ink/55">
          <li>
            · <b className="font-semibold text-ink/75">PNG 파일</b>로 올려주세요
            (SVG는 등록되지 않습니다)
          </li>
          <li>
            ·{" "}
            <b className="font-semibold text-ink/75">
              세로 {LOGO_MIN_HEIGHT}px 이상
            </b>{" "}
            — 작으면 고화질 화면에서 흐려집니다
          </li>
          <li>
            · <b className="font-semibold text-ink/75">배경이 투명</b>해야
            합니다 — 배경이 있으면 헤더에 사각형이 그대로 보입니다
          </li>
          <li>
            · <b className="font-semibold text-ink/75">단색(검정)</b>으로
            올려주세요 — 어두운 배경에서는 흰색으로 자동 변환됩니다
          </li>
        </ul>

        <div className="mt-5">
          {/* The stored file keeps its own ratio, so the preview box has no
              fixed shape to mirror — it takes the current wordmark's, and
              `contain` letterboxes anything narrower without distorting it. */}
          <AdminImageUpload
            ratio={`${SITE.logo.width} / ${SITE.logo.height}`}
            fit="contain"
            name="logo"
            initialUrl={mediaUrl(initial.brand.logo?.path)}
            minHeight={LOGO_MIN_HEIGHT}
            requireTransparent
            output={{ height: LOGO_OUTPUT_HEIGHT }}
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
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="max-w-sm"
            />
          </AdminField>
          <AdminField label="회사 한줄소개" htmlFor="intro">
            <AdminInput
              id="intro"
              name="intro"
              value={brandInfo}
              onChange={(e) => setBrandInfo(e.target.value)}
            />
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
              defaultValue={initial.socials.instagram}
              placeholder="https://instagram.com/..."
            />
          </AdminField>
          <AdminField label="유튜브 (선택)" htmlFor="youtube">
            <AdminInput
              id="youtube"
              name="youtube"
              defaultValue={initial.socials.youtube}
              placeholder="https://youtube.com/@..."
            />
          </AdminField>
          <AdminField label="기타 메신저 (선택)" htmlFor="messenger">
            <AdminInput
              id="messenger"
              name="messenger"
              defaultValue={initial.socials.messenger}
              placeholder="카카오톡·텔레그램 등 링크"
            />
          </AdminField>
        </div>
      </section>

      {/* Uploads fail for reasons the operator can act on (file too large,
          network dropped), so the action reports them instead of throwing. */}
      {state.error && (
        <p className="flex items-start gap-1.5 text-sm text-red-600">
          <TriangleAlert size={15} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <AdminFormActions cancelHref="/admin" />
    </form>
  );
}
