// This barrel exports server-only readers (`"use cache"`, the cookie-bearing
// client), so a client component must not import values from it — that pulls
// them into the client graph and the build fails. Type-only imports are erased
// and are fine; for the card, import "@entities/content/ui/content-card".
export type {
  Content,
  ContentCategory,
  ContentMediaType,
} from "./model/types";
export { CONTENT_CATEGORIES, CONTENT_THUMB_RATIO } from "./model/types";
export { getContents, getContentByRef, CONTENT_TAG } from "./api/get-contents";
export {
  getContentCategories,
  getContentCategoriesAdmin,
  addContentCategory,
  deleteContentCategory,
  updateContentCategory,
  reassignContentsCategory,
  categoryNameExists,
  getContentCategoryName,
  isContentCategoryInUse,
  type ContentCategoryRow,
} from "./api/get-categories";
export {
  getContentsAdmin,
  getContentByRefAdmin,
  getContentThumbnail,
  createContent,
  updateContent,
  deleteContent,
  slugTaken,
  type ContentInput,
} from "./api/update-content";
export { ContentCard } from "./ui/content-card";
