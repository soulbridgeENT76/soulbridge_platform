import { PageShell } from "@widgets/page-shell";
import { HeroSlider } from "@widgets/hero-slider";
import { getSiteLogo } from "@entities/brand";

/** Landing page: five full-screen slides, each an entrance to a sub page. */
export async function HomeView() {
  // PageShell passes the logo to the chrome it owns, but the hero sits inside
  // `children` where it cannot reach. Reading it again is free — the same
  // cached entry answers both calls.
  const logo = await getSiteLogo();

  return (
    <PageShell headerVariant="overlay" padTop={false}>
      <HeroSlider logo={logo} />
    </PageShell>
  );
}
