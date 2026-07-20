import type { NextConfig } from "next";

/**
 * Supabase Storage serves the uploaded logo, and next/image refuses any host it
 * was not told about. Derive the pattern from the env rather than listing hosts,
 * so local (http://127.0.0.1:54321) and hosted (https://<ref>.supabase.co) both
 * work from the same config — Next loads .env* before evaluating this file.
 *
 * Scoped to the public-object prefix so this is not an open image proxy for
 * everything else the Supabase host serves.
 */
function supabaseImagePattern() {
  const { protocol, hostname, port } = new URL(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
  );
  return {
    protocol: protocol.replace(":", "") as "http" | "https",
    hostname,
    port, // "" for default ports, which is what remotePatterns expects
    pathname: "/**",
  };
}

/**
 * Next refuses to optimize images whose host resolves to a private IP — an
 * SSRF guard. That blocks the local Supabase stack on 127.0.0.1, so banners and
 * the logo render broken in local development.
 *
 * Scoped to exactly that case: the flag turns on only when the configured
 * Supabase host is itself local, so a hosted *.supabase.co project never
 * enables it and the guard stays intact everywhere it matters.
 */
const LOCAL_SUPABASE = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
);

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [supabaseImagePattern()],
    dangerouslyAllowLocalIP: LOCAL_SUPABASE,
  },
};

export default nextConfig;
