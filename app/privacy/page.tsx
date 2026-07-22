import type { Metadata } from "next";
import { PrivacyView } from "@views/legal";

export const metadata: Metadata = { title: "개인정보 처리방침" };

export default function PrivacyPage() {
  return <PrivacyView />;
}
