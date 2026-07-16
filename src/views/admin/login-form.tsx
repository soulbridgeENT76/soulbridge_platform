"use client";

import { type FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { AdminField, AdminInput, AdminButton } from "@widgets/admin-shell";
import { SITE } from "@shared/config/site";
import { createClient } from "@/lib/supabase/client";

/** Admin sign-in. Rendered outside the sidebar shell. */
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    });

    if (signInError) {
      // Deliberately vague — saying which half was wrong tells an attacker
      // which accounts exist.
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setPending(false);
      return;
    }

    // refresh() so the server components re-render with the new session cookie.
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center">
          <Image
            src={SITE.logo.src}
            alt={SITE.name}
            width={SITE.logo.width}
            height={SITE.logo.height}
            priority
            className="h-12 w-auto"
          />
          <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">
            Admin
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col gap-5">
            <AdminField label="이메일" htmlFor="email">
              <AdminInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@soulbridge.com"
              />
            </AdminField>

            <AdminField label="비밀번호" htmlFor="password">
              <AdminInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
              />
            </AdminField>
          </div>

          {error && (
            <p className="mt-4 flex items-start gap-1.5 text-xs text-red-600">
              <TriangleAlert size={13} className="mt-px shrink-0" />
              {error}
            </p>
          )}

          <AdminButton
            type="submit"
            variant="solid"
            disabled={pending}
            className="mt-6 w-full py-2.5 disabled:opacity-60"
          >
            {pending ? "로그인 중…" : "로그인"}
          </AdminButton>
        </form>

        <p className="mt-6 text-center text-xs text-ink/40">
          관리자 전용 페이지입니다.
        </p>
      </div>
    </div>
  );
}
