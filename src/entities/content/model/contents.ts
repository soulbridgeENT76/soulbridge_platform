import type { Content } from "./types";

/** Content lineup from the design doc (static; mirrors a future DB table). */
export const CONTENTS: Content[] = [
  {
    slug: "bridge-people-s1",
    title: "다리를 놓는 사람들 : 시즌 1",
    category: "YOUTUBE",
    year: "2026 — ONGOING",
    note: "인터뷰 다큐",
    featured: true,
    badge: "YOUTUBE ORIGINAL — NOW STREAMING",
    description: "매주 수요일, 진심이 오가는 인터뷰 다큐 시리즈. 시즌 1 공개 중.",
  },
  { slug: "temperature-of-sincerity", title: "진심의 온도", category: "YOUTUBE", year: "2026", note: "교양 시리즈" },
  { slug: "bridge-talk", title: "브릿지 토크", category: "YOUTUBE", year: "2026", note: "인터뷰 예능" },
  { slug: "soulbridge-drama", title: "소울브릿지 (가제)", category: "DRAMA · OTT", year: "2027", note: "공동 기획" },
  { slug: "art-of-connection", title: "연결의 기술", category: "DRAMA · OTT", year: "2028", note: "글로벌 유통" },
  { slug: "second-season", title: "두 번째 계절", category: "WEBTOON", year: "2027", note: "로크미디어 제휴" },
  { slug: "night-interview", title: "밤의 인터뷰", category: "WEBNOVEL", year: "2027", note: "원천 IP" },
];

export const FEATURED_CONTENT = CONTENTS.find((c) => c.featured) ?? CONTENTS[0];
