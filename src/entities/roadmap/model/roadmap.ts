export type RoadmapPhase = {
  phase: string;
  period: string;
  title: string;
  description: string;
};

/** 3-year growth roadmap from the ABOUT page of the design doc. */
export const ROADMAP: RoadmapPhase[] = [
  {
    phase: "PHASE 01",
    period: "2026.06",
    title: "법인 설립",
    description: "오리지널 뉴미디어 유튜브 채널 및 핵심 기획 인프라 셋업",
  },
  {
    phase: "PHASE 02",
    period: "2026.H2",
    title: "콘텐츠 론칭",
    description: "자체 유튜브 핵심 콘텐츠 론칭 및 고정 시청자층 확보",
  },
  {
    phase: "PHASE 03",
    period: "2027",
    title: "IP 확장",
    description: "드라마·영화·OTT 공동 기획, 웹툰·웹소설 원형 발굴 및 판권 확보",
  },
  {
    phase: "PHASE 04",
    period: "2028",
    title: "트랜스미디어 실현",
    description: "대형 IP 트랜스미디어 실현, 국내 2대 종합 엔터테인먼트사 도약",
  },
];
