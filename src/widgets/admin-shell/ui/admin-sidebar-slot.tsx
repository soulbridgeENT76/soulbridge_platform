import { getSiteLogo } from "@entities/brand";
import { AdminSidebar } from "./admin-sidebar";

/**
 * Server wrapper that feeds the sidebar its logo.
 *
 * The admin layout is deliberately synchronous — awaiting anything at its top
 * level would block the whole route under cacheComponents — so the await lives
 * here instead, inside the Suspense boundary the layout already provides.
 */
export async function AdminSidebarSlot() {
  return <AdminSidebar logo={await getSiteLogo()} />;
}
