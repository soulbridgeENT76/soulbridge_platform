import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Soul Bridge ENT",
  robots: { index: false, follow: false },
};

/**
 * Shared by every admin route, including the login screen. Deliberately holds
 * no chrome — the sidebar shell lives in the `(shell)` group so that `/admin/
 * login` can render standalone.
 */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
