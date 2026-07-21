import {
  AdminPageHeader,
} from "@widgets/admin-shell";
import { SectionVisibilityToggle } from "@widgets/admin-shell/ui/section-visibility-toggle";
import { AboutEditor } from "@views/admin";
import { getPageCopy, getAboutContent } from "@entities/page-content";

export default async function AdminAboutPage() {
  const [copy, about] = await Promise.all([
    getPageCopy("about"),
    getAboutContent(),
  ]);

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
        <AboutEditor
          copy={copy}
          leadership={about.leadership}
          sections={about.sections}
        />
      </div>
    </div>
  );
}
