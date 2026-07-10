import type { Artist } from "./types";

/**
 * Roster from the design doc. Static for now; the shape mirrors a future
 * Supabase `artists` table so the data source can be swapped without touching
 * the UI. Images are placeholders until real profile cuts are supplied.
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
        "뉴스데스크 앵커에서 미디어 비저너리로. 신뢰의 목소리가 소울브릿지의 이야기를 이끕니다.",
    },
  },
  { slug: "kim-seo-hyun", nameKo: "김서현", nameEn: "KIM SEO-HYUN", role: "배우" },
  { slug: "lee-do-yoon", nameKo: "이도윤", nameEn: "LEE DO-YOON", role: "크리에이터" },
  { slug: "park-chae-won", nameKo: "박채원", nameEn: "PARK CHAE-WON", role: "배우" },
  { slug: "jung-ha-ram", nameKo: "정하람", nameEn: "JUNG HA-RAM", role: "방송인" },
  { slug: "choi-eun-ho", nameKo: "최은호", nameEn: "CHOI EUN-HO", role: "크리에이터" },
];

export const SPOTLIGHT_ARTIST = ARTISTS.find((a) => a.spotlight) ?? ARTISTS[0];
