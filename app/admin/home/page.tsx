import { AdminPageHeader } from "@widgets/admin-shell";
import { HomeEditor } from "@views/admin";

export default function AdminHomePage() {
  return (
    <div>
      <AdminPageHeader
        title="홈"
        description="홈 화면 히어로 슬라이드(1~5화면)를 관리합니다."
      />
      <div className="mt-8">
        <HomeEditor />
      </div>
    </div>
  );
}
