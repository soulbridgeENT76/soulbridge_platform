import { updateSession } from "@/lib/supabase/proxy";
import { type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // The public marketing site (home + ABOUT/CONTENTS/ARTISTS/NEWS/CONTACT) is
  // open to everyone, so we only run the Supabase session/guard middleware on
  // routes that actually require auth. Widen this matcher when more
  // authenticated areas are added.
  //
  // /admin/login is matched on purpose: the proxy lets it through, and running
  // here is what keeps the session cookie refreshed across the admin area.
  matcher: ["/protected/:path*", "/admin/:path*"],
};
