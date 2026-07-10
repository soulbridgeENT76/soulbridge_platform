import type { Metadata } from "next";
import { ContentsView } from "@views/contents";

export const metadata: Metadata = { title: "Contents" };

export default function ContentsPage() {
  return <ContentsView />;
}
