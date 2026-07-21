import type { CSSProperties } from "react";
import type { SocialLink } from "@shared/config/socials";
import { SocialLinks } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { SiteLogo } from "@entities/brand";

/** Extrusion depth: how many offset copies build the 3D side wall. */
const DEPTH = 9;
/** Per-layer offset in px. Straight down (no sideways drift) reads as a slab
 *  lit head-on rather than raked from one corner. */
const STEP_X = 0;
const STEP_Y = 2;

/** Masks a layer to the real logo artwork, so letter spacing and lockup match
 *  the official file exactly instead of being re-typeset by hand. Built per
 *  render rather than once at module scope: the artwork now comes from the CMS.
 *  The URL is quoted because an uploaded path is not guaranteed to be bare. */
function logoMask(src: string): CSSProperties {
  return {
    maskImage: `url("${src}")`,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskImage: `url("${src}")`,
    WebkitMaskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
  };
}

/**
 * Large brand wordmark, extruded. Every layer is the actual logo artwork used
 * as a CSS mask — the lockup is therefore pixel-identical to the brand file.
 * Depth comes from offset copies in a darkening lavender ramp; the face stays
 * the same tone as the hero background and is lit head-on, so the letters read
 * as 3D purely through shading and the cast shadow.
 */
export function HeroWordmark({ logo }: { logo: SiteLogo }) {
  const mask = logoMask(logo.src);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden select-none items-center pr-16 md:flex lg:pr-28"
    >
      <div
        className="relative w-200 lg:w-264"
        style={{
          aspectRatio: `${logo.width} / ${logo.height}`,
          filter: "drop-shadow(0 9px 11px rgba(74, 54, 99, 0.2))",
        }}
      >
        {/* Side wall — darkest at the back, easing up toward the face. */}
        {Array.from({ length: DEPTH }, (_, i) => {
          const t = i / (DEPTH - 1);
          const r = 174 + Math.round(t * 30);
          const g = 162 + Math.round(t * 31);
          const b = 200 + Math.round(t * 22);
          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                ...mask,
                backgroundColor: `rgb(${r}, ${g}, ${b})`,
                transform: `translate(${(DEPTH - i) * STEP_X}px, ${
                  (DEPTH - i) * STEP_Y
                }px)`,
              }}
            />
          );
        })}
        {/* Lit face on top — same lavender family as the background. */}
        <div
          className="absolute inset-0"
          style={{
            ...mask,
            background:
              "radial-gradient(70% 75% at 50% 45%, #E9E1F6 0%, #D8CDE9 100%)",
          }}
        />
      </div>
    </div>
  );
}

/** Social links pinned to the bottom-left of the hero. */
export function HeroSocials({ socials }: { socials: readonly SocialLink[] }) {
  return (
    <SocialLinks
      items={socials}
      size={20}
      className="absolute bottom-8 left-6 md:left-10 lg:left-16"
      itemClassName="text-ink/70 hover:text-ink"
    />
  );
}

/**
 * Non-interactive "scroll is possible" hint — an animated mouse + "SCROLL".
 * Positioning, color and visibility are controlled by the parent via className.
 */
export function ScrollMouse({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none flex flex-col items-center gap-3",
        className
      )}
    >
      <span className="flex h-9 w-6 justify-center rounded-full border border-current pt-2">
        <span className="h-1.5 w-1 animate-bounce rounded-full bg-current" />
      </span>
      <span className="font-display text-[11px] font-semibold uppercase tracking-[0.3em]">
        SCROLL
      </span>
    </div>
  );
}
