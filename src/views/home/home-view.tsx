import { PageShell } from "@widgets/page-shell";
import { HeroSlider } from "@widgets/hero-slider";
import { getSiteLogo, getSiteBrand } from "@entities/brand";
import { getVisibleHomeSlides } from "@entities/page-content";
import { getPublishedNotices } from "@entities/notices";

/** Landing page: full-screen slides, each an entrance to a sub page. */
export async function HomeView() {
  // PageShell passes the logo to the chrome it owns, but the hero sits inside
  // `children` where it cannot reach. Reading it again is free — the same
  // cached entry answers both calls.
  const [logo, brand, slides, notices] = await Promise.all([
    getSiteLogo(),
    getSiteBrand(),
    getVisibleHomeSlides(),
    getPublishedNotices(),
  ]);

  return (
    <PageShell headerVariant="overlay" padTop={false}>
      <HeroSlider
        logo={logo}
        socials={brand.socials}
        slides={slides}
        notices={notices}
      />
    </PageShell>
  );
}
