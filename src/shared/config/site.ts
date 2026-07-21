/**
 * Global, rarely-changing site configuration (brand, navigation, contact).
 * Kept as a single source of truth so the header, footer and metadata stay
 * in sync. Frequently-changing content lives in the `entities` layer instead.
 */

export type NavItem = {
  /** English label shown in the nav (design uses uppercase English). */
  label: string;
  href: string;
  /**
   * Section publish switch. When `false`, the section is hidden from the site
   * navigation (the page route itself stays reachable by direct URL).
   * Omitted / `true` means visible. TODO(backend): drive from a settings table.
   */
  active?: boolean;
};

export const SITE = {
  name: "Soul Bridge ENT",
  nameKo: "소울브릿지 ENT",
  /** One-line company intro shown next to the footer logo. */
  intro: "영혼과 영혼을 잇는 미래 엔터테인먼트",
  /**
   * Wordmark lockup. Monochrome black on transparent, so the footer can flip
   * it to white with a CSS filter. Set to null to fall back to the text logo.
   */
  logo: { src: "/logo.png", width: 826, height: 373 },
  tagline: {
    en: "CONNECTING SOULS, INSPIRING LIVES.",
    ko: "사람과 사람을 잇는 이야기,\n소울브릿지 ENT",
  },
  description:
    " 한 사람의 진심 어린 이야기가\n 누군가에게 다시 나아갈 힘이 되기를.\n 우리는 그 이야기를 가장 따뜻하고 깊이 있게 담아냅니다.",
  /** Copyright notice WITHOUT the year — the year is prepended automatically. */
  copyright: "SOUL BRIDGE ENT. ALL RIGHTS RESERVED.",
} as const;

export const NAV: NavItem[] = [
  { label: "ABOUT", href: "/about", active: true },
  { label: "CONTENTS", href: "/contents", active: true },
  { label: "ARTISTS", href: "/artists", active: true },
  { label: "NOTICE", href: "/notice", active: true },
  { label: "CONTACT", href: "/contact", active: true },
];

export const CONTACT = {
  email: "soulbridgeent@gmail.com",
  address: "서울특별시 000 주소 추후 기재",
  tel: "02-000-0000",
  hours: "평일 10:00 – 18:00",
  directions: "지하철 이용 시 가까운 역·출구 안내를 이곳에 기재합니다.",
  /**
   * Searchable address for the map. The Google embed + Naver/Kakao links are
   * derived from this string via `buildMapLinks` — no embed URLs to paste.
   * Can differ from the display `address` above.
   */
  mapAddress: "서울특별시 마포구 성암로 330 DMC첨단산업센터",
} as const;

// Social links are CMS-driven — see @shared/config/socials for the key/icon
// registry and @entities/brand `getSiteBrand()` for the stored values.
