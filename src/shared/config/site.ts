/**
 * Global, rarely-changing site configuration (brand, navigation, contact).
 * Kept as a single source of truth so the header, footer and metadata stay
 * in sync. Frequently-changing content lives in the `entities` layer instead.
 */

export type NavItem = {
  /** English label shown in the nav (design uses uppercase English). */
  label: string;
  href: string;
};

export const SITE = {
  name: "Soul Bridge ENT",
  nameKo: "소울브릿지 ENT",
  tagline: {
    en: "CONNECTING SOULS, INSPIRING LIVES.",
    ko: "사람과 사람을 잇는 이야기,\n소울브릿지 ENT",
  },
  description:
    " 한 사람의 진심 어린 이야기가\n 누군가에게 다시 나아갈 힘이 되기를.\n 우리는 그 이야기를 가장 따뜻하고 깊이 있게 담아냅니다.",
  copyright: "© 2026 SOUL BRIDGE ENT. ALL RIGHTS RESERVED.",
} as const;

export const NAV: NavItem[] = [
  { label: "ABOUT", href: "/about" },
  { label: "CONTENTS", href: "/contents" },
  { label: "ARTISTS", href: "/artists" },
  { label: "NEWS", href: "/news" },
  { label: "CONTACT", href: "/contact" },
];

export const CONTACT = {
  email: "soulbridgeent@gmail.com",
  address: "서울특별시 마포구 (주소 추후 기재)",
  tel: "02-000-0000",
  hours: "평일 10:00 – 18:00",
  directions: "지하철 이용 시 가까운 역·출구 안내를 이곳에 기재합니다.",
  maps: {
    naver: "#",
    kakao: "#",
  },
} as const;

export type SocialLink = { label: string; href: string };

export const SOCIALS: SocialLink[] = [
  { label: "INSTAGRAM", href: "#" },
  { label: "YOUTUBE", href: "#" },
  { label: "KAKAO", href: "#" },
];
