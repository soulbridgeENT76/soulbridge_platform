import { AdminPageHeader } from "@widgets/admin-shell";
import { ContactEditor } from "@views/admin";

export default function AdminContactPage() {
  return (
    <div>
      <AdminPageHeader
        title="CONTACT"
        description="CONTACT 페이지의 문구·연락처·지도를 관리합니다."
      />
      <div className="mt-8">
        <ContactEditor />
      </div>
    </div>
  );
}
