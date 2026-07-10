import { PageShell } from "@widgets/page-shell";
import { HeroSlider } from "@widgets/hero-slider";

/** Landing page: five full-screen slides, each an entrance to a sub page. */
export function HomeView() {
  return (
    <PageShell headerVariant="overlay" padTop={false}>
      <HeroSlider />
    </PageShell>
  );
}
