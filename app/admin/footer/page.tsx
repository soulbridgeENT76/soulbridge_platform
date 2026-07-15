import { AdminPageHeader } from "@widgets/admin-shell";
import { FooterEditor } from "@views/admin";

export default function AdminFooterPage() {
  return (
    <div>
      <AdminPageHeader
        title="FOOTER"
        description="모든 페이지 하단에 표시되는 푸터 정보를 관리합니다."
      />
      <div className="mt-8">
        <FooterEditor />
      </div>
    </div>
  );
}
