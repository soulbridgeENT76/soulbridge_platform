import type { Metadata } from "next";
import { NewsView } from "@views/news";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  return <NewsView />;
}
