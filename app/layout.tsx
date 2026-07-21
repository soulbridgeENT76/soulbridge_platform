import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SITE } from "@shared/config/site";
import { getSiteBrand } from "@entities/brand";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Async so the company name comes from the CMS. It reads the same cached,
// cookie-free brand entry the page chrome uses, so this costs no extra query
// and keeps every route prerenderable.
export async function generateMetadata(): Promise<Metadata> {
  const { name } = await getSiteBrand();
  return {
    metadataBase: new URL(defaultUrl),
    title: {
      default: `${name} — ${SITE.tagline.en}`,
      template: `%s | ${name}`,
    },
    description: SITE.description,
  };
}

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
