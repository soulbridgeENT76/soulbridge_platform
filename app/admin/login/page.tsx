import type { Metadata } from "next";
import { LoginForm } from "@views/admin";

export const metadata: Metadata = { title: "로그인 · Admin" };

export default function AdminLoginPage() {
  return <LoginForm />;
}
