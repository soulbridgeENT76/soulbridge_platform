import {
  AdminPageHeader,
} from "@widgets/admin-shell";
import { SectionVisibilityToggle } from "@widgets/admin-shell/ui/section-visibility-toggle";
import { ContactEditor } from "@views/admin";
import { socialSummary } from "@shared/config/socials";
import { getBrand, resolveSiteBrand } from "@entities/brand";

export default async function AdminContactPage() {
  const { socials } = resolveSiteBrand(await getBrand());

  return (
    <div>
      <AdminPageHeader
        title="CONTACT"
        description="CONTACT 페이지의 문구·연락처·지도를 관리합니다."
      />
      <div className="mt-8">
        <SectionVisibilityToggle href="/contact" />
      </div>
      <div className="mt-6">
        <ContactEditor socialsSummary={socialSummary(socials) || "미설정"} />
      </div>
    </div>
  );
}
