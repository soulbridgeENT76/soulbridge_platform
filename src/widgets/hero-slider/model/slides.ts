import { SITE } from "@shared/config/site";
import { PUBLISHED_NEWS, type NewsItem } from "@entities/news";

export type HeroSlide = {
  id: string;
  /** Background color (from the brand palette). Also the base/fallback shown
   *  while `image` loads, or when a slide has no image at all. */
  bg: string;
  /** Full-bleed banner image. When set it replaces the paper texture and the
   *  decorative wordmark. */
  image?: string;
  /** Text scheme over the background. */
  scheme: "light" | "dark";
  eyebrow: string;
  titleEn?: string;
  titleKo: string;
  body?: string;
  cta: { label: string; href: string };
  /** Optional list of pill labels (vision slide). */
  pills?: readonly string[];
  /** Optional latest-news preview (news slide). */
  news?: readonly NewsItem[];
};

/** The five full-screen home slides, composed from the entity layer. */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "slogan",
    bg: "#DCD2EC",
    scheme: "dark",
    eyebrow: SITE.tagline.en,
    titleKo: SITE.tagline.ko,
    body: SITE.description,
    cta: { label: "OUR STORY", href: "/about" },
  },
  {
    id: "contents",
    bg: "#F4F2EE",
    scheme: "dark",
    eyebrow: "CONTENTS",
    titleKo: "이야기를 담아내는\n모든 방식",
    body: "유튜브 오리지널부터 드라마, 웹툰·웹소설 IP까지.\n소울브릿지ENT가 만드는 이야기.",
    cta: { label: "VIEW CONTENTS", href: "/contents" },
  },
  {
    id: "artists",
    bg: "#B7A9BC",
    scheme: "dark",
    eyebrow: "ARTISTS",
    titleKo: "이야기를 전하는\n사람들",
    body: "방송인, 배우, 크리에이터.\n각자의 목소리로 이야기를 전하는 사람들.",
    cta: { label: "MEET OUR ARTISTS", href: "/artists" },
  },
  {
    id: "news",
    bg: "#E5E2DC",
    scheme: "dark",
    eyebrow: "LATEST NEWS",
    titleKo: "소울브릿지ENT의\n새로운 소식",
    news: PUBLISHED_NEWS.slice(0, 3),
    cta: { label: "VIEW ALL NEWS", href: "/news" },
  },
  {
    id: "contact",
    bg: "#A493A9",
    scheme: "dark",
    eyebrow: "GET IN TOUCH",
    titleKo: "당신의 이야기를\n들려주세요",
    body: "제휴·캐스팅·미디어 협업 문의를 기다립니다.\n소울브릿지ENT와 함께 새로운 이야기를 만들어가요.",
    cta: { label: "CONTACT US", href: "/contact" },
  },
];
