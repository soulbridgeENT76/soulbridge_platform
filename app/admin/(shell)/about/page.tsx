import {
  AdminPageHeader,
  SectionVisibilityToggle,
} from "@widgets/admin-shell";
import { AboutEditor } from "@views/admin";

export default function AdminAboutPage() {
  return (
    <div>
      <AdminPageHeader
        title="ABOUT"
        description="ABOUT 페이지의 문구와 섹션을 관리합니다."
      />
      <div className="mt-8">
        <SectionVisibilityToggle href="/about" />
      </div>
      <div className="mt-6">
        <AboutEditor />
      </div>
    </div>
  );
}
