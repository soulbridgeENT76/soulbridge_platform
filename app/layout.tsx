import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SITE } from "@shared/config/site";
import { SITE_URL } from "@shared/config/site-url";
import { getSiteBrand } from "@entities/brand";
import "./globals.css";

// Async so the company name comes from the CMS. It reads the same cached,
// cookie-free brand entry the page chrome uses, so this costs no extra query
// and keeps every route prerenderable.
export async function generateMetadata(): Promise<Metadata> {
  const { name } = await getSiteBrand();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} — ${SITE.tagline.en}`,
      template: `%s | ${name}`,
    },
    description: SITE.description,
    // Both point at public/og-image.png. Set here rather than through the
    // app/opengraph-image.png file convention: a config `images` wins over the
    // file, so keeping both would only make the home page — the one segment the
    // file belongs to — advertise a different URL than every other route.
    openGraph: {
      siteName: name,
      images: {
        url: "/og-image.png",
      },
    },
    // No `title` here on purpose: setting one at the root freezes it for every
    // child route, since a page that omits `twitter` inherits this whole object.
    // Left out, twitter:title follows the page title like og:title does.
    twitter: {
      images: {
        url: "/og-image.png",
      },
    },
    // Advertises /rss.xml in the head so feed readers and crawlers discover it
    // without being told the URL.
    alternates: {
      types: {
        "application/rss+xml": [{ url: "/rss.xml", title: `${name} 새 소식` }],
      },
    },
    // 네이버 서치어드바이저 사이트 소유확인용. `<meta name="naver-site-verification">`
    // 로 head 에 들어간다. 구글 등 다른 검색엔진을 추가할 때도 여기에 넣으면 된다.
    verification: {
      other: {
        "naver-site-verification": NAVER_SITE_VERIFICATION,
      },
    },
  };
}

/** 네이버 서치어드바이저 > 사이트 관리 > 소유확인 에서 발급받은 코드. */
const NAVER_SITE_VERIFICATION = "ab6cb3df7b0fba87ac57c2d4d46650094039290f";

const archivo = Archivo({
  variable: "--font-archivo",
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={archivo.variable}>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
