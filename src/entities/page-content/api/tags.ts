/**
 * Cache tag shared by every page_contents reader (home slides, page copy, about
 * content, section visibility). Lives in its own module so readers can import
 * it without pulling in each other — get-sections and get-home-slides both need
 * it and reference each other, which a shared definition would make circular.
 *
 * Invalidated by the admin save actions via updateTag().
 */
export const PAGE_CONTENT_TAG = "page-content";
