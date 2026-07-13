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
    synopsis:
      "각자의 자리에서 세상과 사람을 잇는 이들을 찾아가는 인터뷰 다큐멘터리. 매 회차 한 명의 이야기를 깊이 있게 담아, 시청자에게 다시 나아갈 힘을 전합니다.",
    // TODO: 실제 영상 ID로 교체 (YouTube URL의 v= 뒤 값)
    youtubeId: "",
  },
  {
    slug: "temperature-of-sincerity",
    title: "진심의 온도",
    category: "YOUTUBE",
    year: "2026",
    note: "교양 시리즈",
    synopsis:
      "일상 속 온기를 되짚는 교양 시리즈. 사람과 사람 사이의 진심이 만들어내는 변화를 따뜻한 시선으로 기록합니다.",
    youtubeId: "",
  },
  {
    slug: "bridge-talk",
    title: "브릿지 토크",
    category: "YOUTUBE",
    year: "2026",
    note: "인터뷰 예능",
    synopsis:
      "화제의 인물과 편안하게 마주 앉는 인터뷰 예능. 가벼운 대화 속에서 예상치 못한 진심을 끌어냅니다.",
    youtubeId: "",
  },
  {
    slug: "soulbridge-drama",
    title: "소울브릿지 (가제)",
    category: "DRAMA · OTT",
    year: "2027",
    note: "공동 기획",
    synopsis:
      "원천 IP를 바탕으로 공동 기획 중인 오리지널 드라마. 메시지 중심의 서사를 고품질 영상으로 구현합니다.",
  },
  {
    slug: "art-of-connection",
    title: "연결의 기술",
    category: "DRAMA · OTT",
    year: "2028",
    note: "글로벌 유통",
    synopsis:
      "글로벌 OTT 유통을 목표로 개발 중인 웰메이드 콘텐츠. 국경을 넘어 공감을 만드는 이야기를 지향합니다.",
  },
  {
    slug: "second-season",
    title: "두 번째 계절",
    category: "WEBTOON",
    year: "2027",
    note: "로크미디어 제휴",
    synopsis:
      "로크미디어와 제휴한 오리지널 웹툰. 원형 서사를 다양한 미디어로 확장할 트랜스미디어 IP입니다.",
  },
  {
    slug: "night-interview",
    title: "밤의 인터뷰",
    category: "WEBNOVEL",
    year: "2027",
    note: "원천 IP",
    synopsis:
      "밤의 공기 속에서 펼쳐지는 미스터리 웹소설. 영상화를 염두에 둔 독점 원천 IP입니다.",
  },
];

export const FEATURED_CONTENT = CONTENTS.find((c) => c.featured) ?? CONTENTS[0];

/** Look up a single content item by its slug. */
export const getContentBySlug = (slug: string): Content | undefined =>
  CONTENTS.find((c) => c.slug === slug);
