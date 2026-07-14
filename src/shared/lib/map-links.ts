/**
 * Build map URLs from a plain address string. The admin only stores an
 * address; the Google embed + Naver/Kakao search links are derived here, so
 * no one has to paste embed-specific URLs.
 */
export type MapLinks = {
  /** Google Maps iframe src (no API key needed). */
  embed: string;
  /** Naver Map search deep link. */
  naver: string;
  /** Kakao Map search deep link. */
  kakao: string;
};

export function buildMapLinks(address: string): MapLinks {
  const q = encodeURIComponent(address);
  return {
    embed: `https://maps.google.com/maps?q=${q}&z=17&output=embed`,
    naver: `https://map.naver.com/p/search/${q}`,
    kakao: `https://map.kakao.com/?q=${q}`,
  };
}
