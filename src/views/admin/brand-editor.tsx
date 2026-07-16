"use client";

import { useState } from "react";
import {
  AdminField,
  AdminInput,
  AdminImageUpload,
  AdminFormActions,
} from "@widgets/admin-shell";
import { LOGO_MIN_WIDTH, LOGO_OUTPUT } from "@shared/config/media";
import { type BrandSettings } from "@entities/brand";
import { saveBrand } from "@/src/features/update-brand";

interface BrandEditorProps {
  initial: BrandSettings;
}

export function BrandEditor({ initial }: BrandEditorProps) {
  const [brandName, setBrandName] = useState(initial.brand.name);
  const [brandInfo, setBrandInfo] = useState(initial.brand.intro);

  return (
    <form action={saveBrand} className="flex flex-col gap-5">
      <section className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-sm font-semibold text-ink">로고</p>
        <p className="mt-0.5 text-xs text-ink/50">
          헤더·푸터·메뉴에 사용됩니다. 삭제하면 텍스트 로고 “{brandName}”로
          표시됩니다.
        </p>

        <ul className="mt-3 flex flex-col gap-1 text-xs text-ink/55">
          <li>
            · <b className="font-semibold text-ink/75">PNG 파일</b>로 올려주세요
            (SVG는 등록되지 않습니다)
          </li>
          <li>
            ·{" "}
            <b className="font-semibold text-ink/75">
              가로 {LOGO_MIN_WIDTH}px 이상
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
          <AdminImageUpload
            ratio={`${LOGO_OUTPUT.width} / ${LOGO_OUTPUT.height}`}
            fit="contain"
            name="logo"
            minWidth={LOGO_MIN_WIDTH}
            requireTransparent
            output={LOGO_OUTPUT}
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

      <AdminFormActions cancelHref="/admin" />
    </form>
  );
}
