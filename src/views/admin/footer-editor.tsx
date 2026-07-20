import { AdminReferenceCard } from "@widgets/admin-shell";
import { CONTACT, SITE, SOCIALS } from "@shared/config/site";

/**
 * Footer editor. All footer content is shared with other pages (brand +
 * contact), so this screen only points to their single source of truth.
 */
export function FooterEditor() {
  return (
    <div className="flex flex-col gap-5">
      <AdminReferenceCard
        title="로고 · 회사명 · 한줄소개 · SNS"
        caption="브랜드 페이지와 동일한 정보입니다. 한 곳에서만 관리돼요."
        href="/admin/brand"
        hrefLabel="브랜드에서 편집"
        rows={[
          { label: "회사명", value: SITE.name },
          { label: "한줄소개", value: SITE.intro },
          { label: "SNS", value: SOCIALS.map((s) => s.label).join(" · ") },
        ]}
      />

      <AdminReferenceCard
        title="주소 · 연락처"
        caption="연락처 페이지와 동일한 정보입니다. 한 곳에서만 관리돼요."
        href="/admin/contact"
        hrefLabel="연락처에서 편집"
        rows={[
          { label: "주소", value: CONTACT.address },
          { label: "번호", value: CONTACT.tel },
          { label: "메일", value: CONTACT.email },
        ]}
      />
    </div>
  );
}
