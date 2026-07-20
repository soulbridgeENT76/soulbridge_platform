import { AdminPageHeader } from "@widgets/admin-shell";
import { HomeEditor } from "@views/admin";
import { getHomeSlides } from "@entities/page-content";

export default async function AdminHomePage() {
  // Unfiltered: a section hidden from the public menu still needs editing.
  const slides = await getHomeSlides();

  return (
    <div>
      <AdminPageHeader
        title="HOME"
        description="홈 화면 히어로 슬라이드(1~5화면)를 관리합니다."
      />
      <div className="mt-8">
        <HomeEditor slides={slides} />
      </div>
    </div>
  );
}
