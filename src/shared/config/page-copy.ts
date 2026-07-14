/**
 * Editable page heading copy (eyebrow + title + subtitle) for section pages.
 * Single source of truth so the public page and the admin editor stay in sync.
 * TODO(backend): move this to the CMS so admins can edit and persist it.
 */

export type PageCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export const PAGE_COPY: Record<
  "contents" | "artists" | "news" | "contact",
  PageCopy
> = {
  contents: {
    eyebrow: "VIEW CONTENTS",
    title: "이야기를 담아내는 모든 방식",
    description:
      "유튜브 오리지널부터 드라마, 웹툰·웹소설 IP까지 — 소울브릿지ENT가 만드는 콘텐츠를 소개합니다.",
  },
  artists: {
    eyebrow: "MEET OUR ARTIST",
    title: "이야기를 전하는 사람들",
    description:
      "방송인부터 배우, 크리에이터까지 — 소울브릿지ENT와 함께 진심을 전하는 아티스트를 소개합니다.",
  },
  news: {
    eyebrow: "VIEW ALL NEWS",
    title: "소울브릿지ENT의 새로운 소식",
    description:
      "보도자료부터 공지까지 — 소울브릿지ENT의 소식을 가장 먼저 전해드립니다.",
  },
  contact: {
    eyebrow: "CONTACT US",
    title: "찾아오시는 길",
    description:
      "협업·제휴·출연 문의를 환영합니다. 아래 연락처로 편하게 연락 주시고, 방문 시 위치는 지도를 참고해 주세요.",
  },
};
