import { AdminPageHeader } from "@widgets/admin-shell";
import { HomeEditor } from "@views/admin";
import { getHomeSlides } from "@entities/page-content";
import { socialSummary } from "@shared/config/socials";
import { getBrand, resolveSiteBrand } from "@entities/brand";

export default async function AdminHomePage() {
  // Unfiltered: a section hidden from the public menu still needs editing.
  const [slides, brand] = await Promise.all([
    getHomeSlides(),
    getBrand().then(resolveSiteBrand),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="HOME"
        description="홈 화면 히어로 슬라이드(1~5화면)를 관리합니다."
      />
      <div className="mt-8">
        <HomeEditor
          slides={slides}
          socialsSummary={socialSummary(brand.socials) || "미설정"}
        />
      </div>
    </div>
  );
}
