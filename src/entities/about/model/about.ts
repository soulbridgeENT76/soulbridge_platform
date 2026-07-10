/** Static ABOUT-page content from the design doc. */

export const ABOUT = {
  eyebrow: "ABOUT US",
  title: "영혼과 영혼을 잇는 미래 엔터테인먼트",
  body: "소울브릿지ENT는 단순한 에이전시를 넘어, 깊이 있는 메시지를 전하는 오리지널 콘텐츠 제작 역량과 독점적인 원천 IP 확장을 기반으로 지속 가능한 미디어 성장을 지향합니다.",
} as const;

export type Leader = {
  role: string;
  nameKo: string;
  bio: string;
  points: string[];
};

export const LEADERSHIP: Leader = {
  role: "CHIEF VISION OFFICER",
  nameKo: "손정은",
  bio: "전 MBC 아나운서이자 간판 뉴스데스크 앵커로서 쌓아 올린 신뢰성과 브랜드 가치를 바탕으로, 소울브릿지의 장기 비전과 글로벌 미디어 네트워크 전략을 책임집니다. 대중에게 신뢰와 가치를 동시에 제공하는 '선한 영향력의 대표 브랜드'를 지향합니다.",
  points: [
    "미디어 콘텐츠 장기 사업전략 총괄 수립",
    "오리지널 포맷 개발 및 콘텐츠 자문 총지휘",
    "핵심 리더십 및 비전 방향성 제시",
  ],
};

export const VISION = {
  eyebrow: "VISION 2028",
  headline: "국내 TOP 2 종합 엔터테인먼트 도약",
  points: [
    "원천 IP 연계율 90% 이상의 고성장 트랜스미디어 매출",
    "글로벌 디지털 구독자 누적 1천만 달성",
    "아시아 시장 내 '메시지 중심 미디어 브랜드' 확립",
  ],
} as const;

/** Trans-media pillars shown on the home vision slide. */
export const TRANSMEDIA_PILLARS = [
  "YOUTUBE ORIGINAL",
  "DRAMA · OTT",
  "WEBTOON · WEBNOVEL",
  "MANAGEMENT",
] as const;
