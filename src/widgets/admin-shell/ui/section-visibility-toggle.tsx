import { NAV } from "@shared/config/site";
import { getSectionActive, sectionSlug } from "@entities/page-content";
import { setSectionVisibility } from "@features/update-section-visibility";
import { AdminStatusToggle } from "./admin-status-toggle";

type SectionVisibilityToggleProps = {
  /** Public route of the section, e.g. "/artists". Matched against NAV. */
  href: string;
};

/**
 * "메뉴 노출" card at the top of each section's admin page. Reads the section's
 * live state from page_contents and flips it on toggle. Turning it off hides the
 * section from the site header + mobile drawer and drops its home banner slide;
 * the page route itself stays reachable by direct URL.
 */
export async function SectionVisibilityToggle({
  href,
}: SectionVisibilityToggleProps) {
  const item = NAV.find((n) => n.href === href);
  if (!item) return null;

  const slug = sectionSlug(href);
  const active = await getSectionActive(slug);

  return (
    <div className="rounded-xl border border-ink/10 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">메뉴 노출</p>
          <p className="mt-0.5 text-xs text-ink/50">
            비활성하면 사이트 상단·모바일 메뉴와 홈 배너에서 <b>{item.label}</b>{" "}
            항목이 숨겨집니다. (페이지 주소로는 계속 접근할 수 있어요.)
          </p>
        </div>
        <AdminStatusToggle
          initial={active}
          itemName={`${item.label} 메뉴`}
          action={setSectionVisibility.bind(null, slug)}
        />
      </div>
    </div>
  );
}
