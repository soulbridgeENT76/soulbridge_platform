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
  matcher: ["/protected/:path*"],
};
