import type { Metadata } from "next";
import { NoticesView } from "@views/notices";

export const metadata: Metadata = { title: "News" };

export default function NoticePage() {
  return <NoticesView />;
}
