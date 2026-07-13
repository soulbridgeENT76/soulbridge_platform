import type { Artist } from "./types";

/**
 * Roster from the design doc. Static for now; the shape mirrors a future
 * Supabase `artists` table so the data source can be swapped without touching
 * the UI. Images are placeholders until real profile cuts are supplied.
 * bio / works / socials are placeholder copy — replace with real profiles.
 */
export const ARTISTS: Artist[] = [
  {
    slug: "sohn-jung-eun",
    nameKo: "손정은",
    nameEn: "SOHN JUNG-EUN",
    role: "방송인",
    spotlight: {
      titleEn: "SOHN JUNG-EUN — CHIEF VISION OFFICER",
      description:
        "뉴스데스크 앵커에서 미디어 비저너리로. 신뢰의 목소리가 소울브릿지ENT의 이야기를 이끕니다.",
    },
    bio: `전 MBC 아나운서이자 간판 뉴스데스크 앵커로서 쌓아 올린 신뢰성과 브랜드 가치를 바탕으로, 소울브릿지ENT의 장기 비전과 글로벌 미디어 네트워크 전략을 이끌고 있습니다.
대중에게 신뢰와 가치를 동시에 전하는 '선한 영향력의 대표 브랜드'를 지향하며, 콘텐츠를 통한 진심의 연결을 실천합니다.`,
    works: [
      { year: "2026", title: "다리를 놓는 사람들 : 시즌 1", role: "기획·내레이션" },
      { year: "2020 — 2024", title: "MBC 뉴스데스크", role: "메인 앵커" },
      { year: "2018", title: "MBC 라디오 정오의 희망곡", role: "진행" },
    ],
    socials: [
      { label: "INSTAGRAM", href: "#" },
      { label: "YOUTUBE", href: "#" },
    ],
  },
  {
    slug: "kim-seo-hyun",
    nameKo: "김서현",
    nameEn: "KIM SEO-HYUN",
    role: "배우",
    bio: `섬세한 감정 연기로 주목받는 라이징 배우. 인물의 내면을 겹겹이 쌓아 올리는 연기로 작품마다 다른 얼굴을 보여줍니다.
소울브릿지ENT와 함께 원천 IP 기반 오리지널 드라마에서 새로운 도전을 준비하고 있습니다.`,
    works: [
      { year: "2027", title: "소울브릿지 (가제)", role: "주연" },
      { year: "2025", title: "단편영화 「봄의 문장」", role: "주연" },
      { year: "2024", title: "웹드라마 「오후 세 시」", role: "조연" },
    ],
    socials: [{ label: "INSTAGRAM", href: "#" }],
  },
  {
    slug: "lee-do-yoon",
    nameKo: "이도윤",
    nameEn: "LEE DO-YOON",
    role: "크리에이터",
    bio: `일상의 진심을 담아내는 뉴미디어 크리에이터. 편안한 화법과 솔직한 시선으로 폭넓은 팬덤을 보유하고 있습니다.
소울브릿지ENT의 오리지널 유튜브 포맷에서 기획과 진행을 맡아 활동합니다.`,
    works: [
      { year: "2026", title: "브릿지 토크", role: "진행" },
      { year: "2026", title: "진심의 온도", role: "패널" },
      { year: "2023 — ", title: "개인 채널 「도윤의 하루」", role: "크리에이터" },
    ],
    socials: [
      { label: "YOUTUBE", href: "#" },
      { label: "INSTAGRAM", href: "#" },
    ],
  },
  {
    slug: "park-chae-won",
    nameKo: "박채원",
    nameEn: "PARK CHAE-WON",
    role: "배우",
    bio: `무대와 스크린을 오가며 탄탄한 기본기를 다져온 배우. 장르를 가리지 않는 폭넓은 스펙트럼이 강점입니다.
글로벌 OTT를 겨냥한 소울브릿지ENT의 웰메이드 프로젝트에 합류를 논의 중입니다.`,
    works: [
      { year: "2028", title: "연결의 기술", role: "주연 (논의 중)" },
      { year: "2024", title: "연극 「겨울 정원」", role: "주연" },
      { year: "2022", title: "드라마 「그해 여름」", role: "조연" },
    ],
    socials: [{ label: "INSTAGRAM", href: "#" }],
  },
  {
    slug: "jung-ha-ram",
    nameKo: "정하람",
    nameEn: "JUNG HA-RAM",
    role: "방송인",
    bio: `현장을 읽는 순발력과 따뜻한 진행으로 신뢰받는 방송인. 인터뷰이의 진심을 자연스럽게 끌어내는 대화가 강점입니다.
소울브릿지ENT의 인터뷰 다큐·교양 콘텐츠에서 활약하고 있습니다.`,
    works: [
      { year: "2026", title: "다리를 놓는 사람들 : 시즌 1", role: "인터뷰어" },
      { year: "2023", title: "지역 방송 「오늘의 이웃」", role: "MC" },
    ],
    socials: [
      { label: "INSTAGRAM", href: "#" },
      { label: "YOUTUBE", href: "#" },
    ],
  },
  {
    slug: "choi-eun-ho",
    nameKo: "최은호",
    nameEn: "CHOI EUN-HO",
    role: "크리에이터",
    bio: `트렌디한 감각과 기획력을 겸비한 콘텐츠 크리에이터. 짧은 포맷부터 시즌제 시리즈까지 다양한 영상을 만들어 왔습니다.
소울브릿지ENT의 뉴미디어 오리지널 채널에서 신규 포맷 개발에 참여합니다.`,
    works: [
      { year: "2026", title: "소울브릿지 오리지널 (기획)", role: "크리에이터" },
      { year: "2022 — ", title: "개인 채널 「은호 필름」", role: "크리에이터" },
    ],
    socials: [{ label: "YOUTUBE", href: "#" }],
  },
];

export const SPOTLIGHT_ARTIST = ARTISTS.find((a) => a.spotlight) ?? ARTISTS[0];

/** Look up a single artist by slug. */
export const getArtistBySlug = (slug: string): Artist | undefined =>
  ARTISTS.find((a) => a.slug === slug);
