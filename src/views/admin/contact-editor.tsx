"use client";

import { useActionState } from "react";
import { TriangleAlert } from "lucide-react";
import {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminFormGrid,
  AdminFormActions,
  AdminReferenceCard,
} from "@widgets/admin-shell";
import { useSaveToast } from "@shared/ui/use-save-toast";
import { useFieldErrors, fieldValue } from "@shared/lib/use-field-errors";
import type { ContactContent } from "@entities/page-content";
import { saveContact } from "@features/update-contact";

/** Digits in hyphen-separated groups: "02-000-0000", "0212345678". */
export const PHONE_PATTERN = /^\d+(-\d+)*$/;

/** A single address: something@something.something, no spaces. */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactEditorProps = {
  initial: ContactContent;
  socialsSummary: string;
};

/**
 * CONTACT page editor — heading copy, contact details, and map location.
 * SNS links are managed on the Brand page.
 */
export function ContactEditor({ initial, socialsSummary }: ContactEditorProps) {
  const [state, formAction, pending] = useActionState(saveContact, { ok: true });
  useSaveToast(state, pending);
  const { errors, clearError, guardSubmit } = useFieldErrors();

  // Phone and email have a format rule; the rest are free text. Both optional,
  // so a blank one is fine — only a filled one is checked.
  const validate = (formData: FormData): Record<string, string> => {
    const errs: Record<string, string> = {};
    const tel = fieldValue(formData, "tel");
    if (tel && !PHONE_PATTERN.test(tel)) {
      errs.tel = "회사번호는 숫자와 - 만 사용할 수 있습니다.";
    }
    const email = fieldValue(formData, "email");
    if (email && !EMAIL_PATTERN.test(email)) {
      errs.email = "올바른 이메일 형식이 아닙니다.";
    }
    return errs;
  };

  const clientSubmit = guardSubmit(validate, ["tel", "email"], formAction);

  return (
    // noValidate turns off the browser's native tooltips (type="email") so the
    // email error shows inline like every other field, not as a popup.
    <form onSubmit={clientSubmit} noValidate className="flex flex-col gap-5">
      {/* Heading copy */}
      <Card title="페이지 문구" caption="CONTACT 상단에 표시되는 제목·부제목입니다.">
        <AdminField label="제목" htmlFor="title">
          <AdminInput id="title" name="title" defaultValue={initial.title} />
        </AdminField>
        <AdminField label="부제목" htmlFor="description" hint="줄바꿈 그대로 반영">
          <AdminTextarea
            id="description"
            name="description"
            defaultValue={initial.description}
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
            defaultValue={initial.address}
          />
        </AdminField>
        <AdminFormGrid>
          <AdminField
            label="회사번호"
            htmlFor="tel"
            hint="숫자와 - 만 사용 가능합니다."
            error={errors.tel}
          >
            <AdminInput
              id="tel"
              name="tel"
              defaultValue={initial.tel}
              inputMode="tel"
              placeholder="예: 02-000-0000"
              aria-invalid={errors.tel ? true : undefined}
              onChange={() => clearError("tel")}
            />
          </AdminField>
          <AdminField label="이메일" htmlFor="email" error={errors.email}>
            <AdminInput
              id="email"
              name="email"
              type="email"
              defaultValue={initial.email}
              aria-invalid={errors.email ? true : undefined}
              onChange={() => clearError("email")}
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
        rows={[{ label: "SNS", value: socialsSummary }]}
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
            defaultValue={initial.mapAddress}
            placeholder="예: 서울특별시 마포구 성암로 330 DMC첨단산업센터"
          />
        </AdminField>
      </Card>

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
