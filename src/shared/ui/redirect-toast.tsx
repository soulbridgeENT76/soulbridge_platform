"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { showToast } from "./toast";

/**
 * Fires a toast once when the page loads carrying a flag in the query string,
 * then strips the flag so a refresh does not re-toast.
 *
 * For forms that redirect on success (artist create/edit): the form's own page
 * is gone by the time the save lands, so it cannot toast the way the stay-put
 * editors do. The action redirects with `?<param>=1` instead, and this — mounted
 * on the destination — turns that into the same confirmation toast.
 */
export function RedirectToast({
  param,
  message = "저장되었습니다",
}: {
  param: string;
  message?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // StrictMode double-mounts in dev; without this the toast fires twice before
  // the URL is cleaned.
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (!searchParams.has(param)) return;
    fired.current = true;

    showToast(message);

    // Drop the flag so a manual refresh does not replay the toast.
    const next = new URLSearchParams(searchParams);
    next.delete(param);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [searchParams, param, message, pathname, router]);

  return null;
}
