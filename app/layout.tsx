import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SITE } from "@shared/config/site";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: `${SITE.name} — ${SITE.tagline.en}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
};

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
