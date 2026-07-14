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
  address: "서울특별시 000 주소 추후 기재",
  tel: "02-000-0000",
  hours: "평일 10:00 – 18:00",
  directions: "지하철 이용 시 가까운 역·출구 안내를 이곳에 기재합니다.",
  maps: {
    /** 임베드는 API 키가 필요 없는 구글맵을 사용하고, 길찾기는 국내 앱으로 연결. */
    embed:
      "https://maps.google.com/maps?q=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EC%84%B1%EC%95%94%EB%A1%9C%20330%20DMC%EC%B2%A8%EB%8B%A8%EC%82%B0%EC%97%85%EC%84%BC%ED%84%B0&z=17&output=embed",
    naver:
      "https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EC%84%B1%EC%95%94%EB%A1%9C%20330",
    kakao:
      "https://map.kakao.com/?q=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EB%A7%88%ED%8F%AC%EA%B5%AC%20%EC%84%B1%EC%95%94%EB%A1%9C%20330",
  },
} as const;

export type SocialLink = { label: string; href: string };

export const SOCIALS: SocialLink[] = [
  { label: "INSTAGRAM", href: "#" },
  { label: "YOUTUBE", href: "#" },
  { label: "KAKAO", href: "#" },
];
