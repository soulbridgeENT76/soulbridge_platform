import { AdminPageHeader } from "@widgets/admin-shell";
import { AboutEditor } from "@views/admin";

export default function AdminAboutPage() {
  return (
    <div>
      <AdminPageHeader
        title="회사소개"
        description="ABOUT 페이지의 문구와 섹션을 관리합니다."
      />
      <div className="mt-8">
        <AboutEditor />
      </div>
    </div>
  );
}
