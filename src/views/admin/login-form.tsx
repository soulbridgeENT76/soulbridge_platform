"use client";

import { type FormEvent, useState } from "react";
import Image from "next/image";
import { TriangleAlert } from "lucide-react";
import { AdminField, AdminInput, AdminButton } from "@widgets/admin-shell";
import { SITE } from "@shared/config/site";

/**
 * Admin sign-in. Rendered outside the sidebar shell.
 * TODO(backend): authenticate against Supabase (see lib/supabase/client.ts),
 * then redirect to /admin. Show `error` on failure.
 */
export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    // TODO(backend): sign in, then router.push("/admin").
    // On failure: setError("이메일 또는 비밀번호가 올바르지 않습니다.")
    setPending(false);
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
