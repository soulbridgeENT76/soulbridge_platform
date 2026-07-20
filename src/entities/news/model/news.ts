import type { NewsItem } from "./types";

/** Press & notices from the design doc, newest first. */
export const NEWS: NewsItem[] = [
  {
    slug: "official-launch",
    active: true,
    date: "2026-07-02",
    category: "NEWS",
    title: '소울브릿지ENT 공식 출범 — "영혼과 영혼을 잇는 미래 엔터테인먼트"',
    body: `소울브릿지ENT가 '영혼과 영혼을 잇는 미래 엔터테인먼트'를 슬로건으로 공식 출범했습니다.
깊이 있는 메시지를 전하는 오리지널 콘텐츠 제작 역량과 독점적인 원천 IP 확장을 기반으로, 지속 가능한 미디어 성장을 지향합니다.
유튜브 오리지널부터 드라마·OTT, 웹툰·웹소설 IP까지 아우르는 종합 미디어 컴퍼니로의 도약을 시작합니다.`,
  },
  {
    slug: "cvo-appointment",
    active: true,
    date: "2026-06-24",
    category: "NEWS",
    title: "손정은 CVO 합류, 장기 비전 및 글로벌 미디어 전략 총괄",
    body: `전 MBC 아나운서이자 간판 뉴스데스크 앵커 손정은이 소울브릿지ENT의 Chief Vision Officer(CVO)로 합류했습니다.
쌓아 올린 신뢰성과 브랜드 가치를 바탕으로 장기 비전과 글로벌 미디어 네트워크 전략을 총괄합니다.
대중에게 신뢰와 가치를 동시에 전하는 '선한 영향력의 대표 브랜드'를 만들어 갈 예정입니다.`,
  },
  {
    slug: "rok-media-partnership",
    active: true,
    date: "2026-06-18",
    category: "NEWS",
    title: "로크미디어와 웹툰·웹소설 원천 IP 파트너십 체결",
    body: `소울브릿지ENT가 로크미디어와 웹툰·웹소설 원천 IP 파트너십을 체결했습니다.
검증된 메가 히트 IP 라이브러리를 활용해 원천 서사를 드라마·영화·애니메이션으로 확장하는 트랜스미디어 사업을 본격 가동합니다.
글로벌 플랫폼 공동 유통 구조를 통해 고부가가치 라이선싱을 실현할 계획입니다.`,
  },
  {
    slug: "youtube-channel-teaser",
    active: true,
    date: "2026-06-10",
    category: "NOTICE",
    title: "오리지널 유튜브 채널 하반기 론칭 예고",
    body: `소울브릿지ENT의 오리지널 뉴미디어 유튜브 채널이 2026년 하반기 론칭됩니다.
대중성과 신뢰성을 결합한 오리지널 포맷의 예능·교양 시리즈를 매 시즌 선보일 예정입니다.
채널 오픈 및 콘텐츠 공개 일정은 추후 공지를 통해 안내드리겠습니다.`,
  },
  {
    slug: "open-audition",
    active: false,
    date: "2026-06-05",
    category: "NOTICE",
    title: "신규 크리에이터·아티스트 상시 오디션 안내",
    body: `소울브릿지ENT와 함께 성장할 신규 크리에이터·아티스트를 상시 모집합니다.
방송인, 배우, 인플루언서 등 미디어 파워 유저를 대상으로 체계적인 브랜딩 케어를 제공합니다.
지원 방법 및 세부 사항은 공식 채널을 통해 안내되며, 문의는 soulbridgeent@gmail.com으로 받습니다.`,
  },
  {
    slug: "incorporation",
    active: true,
    date: "2026-06-01",
    category: "NEWS",
    title: "소울브릿지ENT 법인 설립 완료",
    body: `소울브릿지ENT가 법인 설립을 완료하고 사업을 공식 개시했습니다.
오리지널 뉴미디어 유튜브 채널과 핵심 기획 인프라 셋업을 시작으로 3개년 성장 로드맵을 실행해 나갑니다.
콘텐츠와 사람, 세대를 잇는 종합 엔터테인먼트로 나아가겠습니다.`,
  },
];

/**
 * Only items switched on are visible on the public site. `NEWS` stays the full
 * list for the admin, which needs to see inactive items too.
 */
export const PUBLISHED_NEWS: NewsItem[] = NEWS.filter((n) => n.active === true);

/** Format an ISO date as the design's "YYYY. MM. DD". */
export function formatNewsDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}. ${m}. ${d}`;
}

/** Look up a single news item by slug. */
export const getNewsBySlug = (slug: string): NewsItem | undefined =>
  NEWS.find((n) => n.slug === slug);

/**
 * True when a row should jump straight to an external URL instead of opening
 * the in-site detail page. Requires both the mode and a URL to be set.
 */
export const isExternalNews = (item: NewsItem): boolean =>
  item.linkType === "external" && Boolean(item.externalUrl);

/** Where a row links to: the external URL, or the in-site detail page. */
export const getNewsHref = (item: NewsItem): string =>
  isExternalNews(item) ? item.externalUrl! : `/notice/${item.slug}`;
