import type { AboutSection as AboutSectionData } from "@entities/page-content";
import { AboutSection } from "./about-section";
import { AboutCards } from "./about-cards";

/**
 * The variable part of the ABOUT page: any number of "label + title + cards"
 * blocks, edited in the admin. Replaces the former fixed Portfolio and Strategy
 * components, which differed only in their heading.
 *
 * Numbering continues from leadership (01), and card numbers come from position
 * — storing them would go stale as soon as an item is reordered or removed.
 */
export function AboutSectionList({
  sections,
}: {
  sections: AboutSectionData[];
}) {
  return (
    <>
      {sections.map((section, i) => (
        <AboutSection
          key={`${section.label}-${i}`}
          index={String(i + 2).padStart(2, "0")}
          eyebrow={section.label}
          title={section.title}
        >
          <AboutCards
            items={section.items.map((item, ii) => ({
              no: String(ii + 1).padStart(2, "0"),
              title: item.title,
              description: item.description,
            }))}
          />
        </AboutSection>
      ))}
    </>
  );
}
