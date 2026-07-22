import type { Metadata } from "next";
import { TermsView } from "@views/legal";

export const metadata: Metadata = { title: "이용약관" };

export default function TermsPage() {
  return <TermsView />;
}
