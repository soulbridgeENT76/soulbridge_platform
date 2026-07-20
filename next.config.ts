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
    pathname: "/storage/v1/object/public/**",
  };
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [supabaseImagePattern()],
  },
};

export default nextConfig;
