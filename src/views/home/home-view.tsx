import { PageShell } from "@widgets/page-shell";
import { HeroSlider } from "@widgets/hero-slider";
import { getSiteLogo } from "@entities/brand";
import { getVisibleHomeSlides } from "@entities/page-content";

/** Landing page: full-screen slides, each an entrance to a sub page. */
export async function HomeView() {
  // PageShell passes the logo to the chrome it owns, but the hero sits inside
  // `children` where it cannot reach. Reading it again is free — the same
  // cached entry answers both calls.
  const [logo, slides] = await Promise.all([
    getSiteLogo(),
    getVisibleHomeSlides(),
  ]);

  return (
    <PageShell headerVariant="overlay" padTop={false}>
      <HeroSlider logo={logo} slides={slides} />
    </PageShell>
  );
}
