import { PageShell } from "@widgets/page-shell";
import { Container, Eyebrow } from "@shared/ui";
import {
  ABOUT,
  LEADERSHIP,
  PORTFOLIO,
  STRATEGY_PILLARS,
} from "@entities/about";
import {
  getPageCopy,
  getAboutContent,
  getSectionEyebrow,
} from "@entities/page-content";
import { LeadershipSection } from "./ui/leadership-section";
import { AboutSectionList } from "./ui/about-section-list";

/**
 * Until the page is saved once from the admin, `metadata` holds no leadership
 * or sections and these constants stand in — the same content the page showed
 * before the CMS existed. After the first save the database wins outright.
 */
const FALLBACK_LEADERSHIP = {
  label: "LEADERSHIP",
  role: LEADERSHIP.role,
  name: LEADERSHIP.nameKo,
  bio: LEADERSHIP.bio,
  points: [...LEADERSHIP.points],
  photo: null,
};

const FALLBACK_SECTIONS = [
  {
    label: "PORTFOLIO",
    title: "주요 사업 포트폴리오 다각화",
    items: PORTFOLIO.map((p) => ({
      title: p.title,
      description: p.description,
    })),
  },
  {
    label: "STRATEGY",
    title: "4대 전략 비즈니스 필러",
    items: STRATEGY_PILLARS.map((p) => ({
      title: p.title,
      description: p.description,
    })),
  },
];

export async function AboutView() {
  // The bundled ABOUT constant is the fallback, not a second source of truth:
  // it only shows if the row is missing or the database is unreachable.
  const [copy, about, eyebrow] = await Promise.all([
    getPageCopy("about"),
    getAboutContent(),
    // The English label mirrors the home banner's CTA button for this section.
    getSectionEyebrow("/about"),
  ]);

  return (
    <PageShell>
      {/* Left-aligned hero */}
      <Container className="pb-10 pt-16 md:pb-14 md:pt-24">
        <Eyebrow className="text-plum">{eyebrow ?? ABOUT.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-4xl whitespace-pre-line text-3xl/[1.25] font-bold tracking-tight text-ink md:text-4xl/[1.25] lg:text-5xl/[1.25]">
          {copy?.title ?? ABOUT.title}
        </h1>
        <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed text-ink/60 md:text-lg">
          {copy?.description ?? ABOUT.body}
        </p>
      </Container>

      <LeadershipSection leader={about.leadership ?? FALLBACK_LEADERSHIP} />
      <AboutSectionList sections={about.sections ?? FALLBACK_SECTIONS} />
    </PageShell>
  );
}
