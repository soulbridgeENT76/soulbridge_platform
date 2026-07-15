import { AdminPageHeader } from "@widgets/admin-shell";
import { BrandEditor } from "@views/admin";

export default function AdminBrandPage() {
  return (
    <div>
      <AdminPageHeader
        title="BRAND"
        description="로고와 회사명 등 사이트 전역에 쓰이는 브랜드 자산을 관리합니다."
      />
      <div className="mt-8">
        <BrandEditor />
      </div>
    </div>
  );
}
