export { AdminSidebar } from "./ui/admin-sidebar";
// AdminSidebarSlot is deliberately NOT re-exported here. Client components
// import this barrel for the form primitives, and pulling the slot in with them
// would drag its server-only data reader into the client graph.
// Import it by path: "@widgets/admin-shell/ui/admin-sidebar-slot".
export { AdminPageHeader } from "./ui/admin-page-header";
export { AdminButton, AdminLinkButton } from "./ui/admin-button";
export {
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminFormGrid,
} from "./ui/admin-fields";
export { AdminImageUpload } from "./ui/admin-image-upload";
export { AdminFormActions } from "./ui/admin-form-actions";
export { DeleteButton } from "./ui/delete-button";
export { AdminReferenceCard } from "./ui/admin-reference-card";
export { AdminStatusToggle } from "./ui/admin-status-toggle";
export { SectionVisibilityToggle } from "./ui/section-visibility-toggle";
