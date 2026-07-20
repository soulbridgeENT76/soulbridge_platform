import type { Metadata } from "next";
import { LoginForm } from "@views/admin";
import { getSiteLogo } from "@entities/brand";

export const metadata: Metadata = { title: "로그인 · Admin" };

export default async function AdminLoginPage() {
  return <LoginForm logo={await getSiteLogo()} />;
}
