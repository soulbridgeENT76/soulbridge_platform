/** Static ABOUT-page content, reconstructed from the business-plan deck. */

export const ABOUT = {
  eyebrow: "OUR STORY",
  title: "영혼과 영혼을 잇는\n미래 엔터테인먼트",
  body: "소울브릿지ENT는 단순한 에이전시를 넘어,\n깊이 있는 메시지를 전하는 오리지널 콘텐츠 제작 역량과\n독점적인 원천 IP 확장을 기반으로 지속 가능한 미디어 성장을 지향합니다.",
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
  bio: "전 MBC 아나운서이자 간판 뉴스데스크 앵커로서 쌓아 올린 신뢰성과 강력한 브랜드 가치를 바탕으로,\n소울브릿지ENT의 장기 비전과 글로벌 미디어 네트워크 전략을 책임집니다.\n대중에게 신뢰와 가치를 동시에 제공하는 '선한 영향력의 대표 브랜드'를 지향합니다.",
  points: [
    "미디어 콘텐츠 장기 사업전략 총괄 수립",
    "오리지널 포맷 개발 및 콘텐츠 자문 총지휘",
    "핵심 리더십 및 비전 방향성 제시",
  ],
};

export type StrategyPillar = {
  no: string;
  title: string;
  description: string;
};

/** PART III — 4 strategic business pillars. */
export const STRATEGY_PILLARS: StrategyPillar[] = [
  {
    no: "01",
    title: "유튜브 오리지널",
    description:
      "고품질의 자체 포맷 기획을 통해 트렌디하고 화제성 높은 뉴미디어 오리지널 채널을 구축합니다.",
  },
  {
    no: "02",
    title: "방송 및 OTT",
    description:
      "기성 방송 채널 공급부터 글로벌 OTT 유통에 이르는 대형 미디어 제작 경쟁력을 확보합니다.",
  },
  {
    no: "03",
    title: "IP 트랜스미디어",
    description:
      "로크미디어 웹소설·웹툰 메가 원형 라이브러리를 영화·드라마·애니메이션으로 확장합니다.",
  },
  {
    no: "04",
    title: "탤런트 매니지먼트",
    description:
      "인플루언서, 전문 방송인, 연기자 등 미디어 파워 유저를 위한 체계적인 브랜딩 케어를 제공합니다.",
  },
];

export type PortfolioArea = {
  no: string;
  title: string;
  description: string;
};

/** PART II — diversified business portfolio. */
export const PORTFOLIO: PortfolioArea[] = [
  {
    no: "01",
    title: "유튜브 & 오리지널 콘텐츠",
    description:
      "대중성과 신뢰성을 결합한 오리지널 포맷의 유튜브 예능·교양 시리즈를 매 시즌 기획하여 고정 시청자층과 강력한 미디어 팬덤을 조기에 확보합니다. 자체 유통 채널 기반의 디지털 다이렉트 수익(광고·협찬·멤버십)을 극대화해 조기 현금 흐름 창출과 생태계 안정을 달성합니다.",
  },
  {
    no: "02",
    title: "방송·OTT 및 IP 트랜스미디어",
    description:
      "파트너사 '로크미디어'의 검증된 웹툰·웹소설 메가 히트 IP 라이브러리를 활용해 원천 서사의 미디어 확장 사업을 전방위로 가동합니다. 원천 스토리 IP를 고퀄리티 드라마·영화, 극장 및 글로벌 OTT용 웰메이드 콘텐츠로 가공·생산하여 고부가가치 라이선싱을 실현합니다.",
  },
  {
    no: "03",
    title: "더미 카드 A",
    description:
      "캐러셀 동작 확인용 더미 데이터입니다. 4개를 초과하면 가로 스크롤과 좌우 이동 버튼이 나타나는지 확인합니다.",
  },
  {
    no: "04",
    title: "더미 카드 B",
    description:
      "캐러셀 동작 확인용 더미 데이터입니다. 실제 콘텐츠 확정 시 교체하거나 삭제하면 됩니다.",
  },
  {
    no: "05",
    title: "더미 카드 C",
    description:
      "캐러셀 동작 확인용 더미 데이터입니다. 5개째 카드로, 우측 넘김 버튼으로 접근합니다.",
  },
];

export const VISION = {
  eyebrow: "VISION 2028",
  metric: "TOP 2",
  headline: "종합 엔터테인먼트 도약",
  subhead: "국내 미디어 시장의 판도를 바꿀 3년",
  body: "소울브릿지ENT는 독점 원천 IP 소싱, 안정적인 디지털 포맷 유통, 고품격 글로벌 아티스트 매니지먼트를 입체적으로 융합하여 3년 내 확실한 업계 'TOP 2'의 영토를 장악합니다.",
  points: [
    "원천 IP 연계율 90% 이상의 고성장 트랜스미디어 매출",
    "소속 크리에이터·아티스트의 글로벌 디지털 구독자 누적 1천만 달성",
    "아시아 시장 내 독보적인 '메시지 중심 미디어 브랜드' 확립",
  ],
} as const;

/** Trans-media pillars (kept for other surfaces). */
export const TRANSMEDIA_PILLARS = [
  "YOUTUBE ORIGINAL",
  "DRAMA · OTT",
  "WEBTOON · WEBNOVEL",
  "MANAGEMENT",
] as const;
