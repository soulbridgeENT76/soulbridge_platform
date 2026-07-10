import type { NewsItem } from "./types";

/** Press & notices from the design doc, newest first. */
export const NEWS: NewsItem[] = [
  {
    slug: "official-launch",
    date: "2026-07-02",
    category: "PRESS",
    title: '소울브릿지ENT 공식 출범 — "영혼과 영혼을 잇는 미래 엔터테인먼트"',
  },
  {
    slug: "cvo-appointment",
    date: "2026-06-24",
    category: "PRESS",
    title: "손정은 CVO 합류, 장기 비전 및 글로벌 미디어 전략 총괄",
  },
  {
    slug: "rok-media-partnership",
    date: "2026-06-18",
    category: "PRESS",
    title: "로크미디어와 웹툰·웹소설 원천 IP 파트너십 체결",
  },
  {
    slug: "youtube-channel-teaser",
    date: "2026-06-10",
    category: "NOTICE",
    title: "오리지널 유튜브 채널 하반기 론칭 예고",
  },
  {
    slug: "open-audition",
    date: "2026-06-05",
    category: "NOTICE",
    title: "신규 크리에이터·아티스트 상시 오디션 안내",
  },
  {
    slug: "incorporation",
    date: "2026-06-01",
    category: "PRESS",
    title: "소울브릿지ENT 법인 설립 완료",
  },
];

/** Format an ISO date as the design's "YYYY. MM. DD". */
export function formatNewsDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}. ${m}. ${d}`;
}
