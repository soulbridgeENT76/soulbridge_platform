import type { IconType } from "react-icons";
import { SiInstagram, SiYoutube } from "react-icons/si";
import { IoChatbubble } from "react-icons/io5";
import { cn } from "@shared/lib/cn";

/** Icons keyed by social label. MESSENGER is a generic chat icon so any
 *  messenger link can be used (KAKAO kept as a legacy alias). */
const BRAND_ICON: Record<string, IconType> = {
  INSTAGRAM: SiInstagram,
  YOUTUBE: SiYoutube,
  MESSENGER: IoChatbubble,
  KAKAO: IoChatbubble,
};

/** Optical size tweak: glyphs fill their box differently, so they read larger
 *  or smaller at the same px size. Nudge each to match the others. */
const OPTICAL_SCALE: Record<string, number> = {
  YOUTUBE: 1.15,
  MESSENGER: 1.05,
  KAKAO: 1.05,
};

/** Per-icon vertical nudge in px (negative = up) to align optical centers. */
const NUDGE_Y: Record<string, number> = {
  MESSENGER: -0.75,
  KAKAO: -0.75,
};

type SocialItem = { label: string; href: string };

type SocialLinksProps = {
  items: readonly SocialItem[];
  /** Icon size in px. */
  size?: number;
  /** Classes for the wrapping row (e.g. gap / justify). */
  className?: string;
  /** Classes for each icon link (e.g. color / hover). */
  itemClassName?: string;
};

/** Row of social links rendered as official brand icons. */
export function SocialLinks({
  items,
  size = 20,
  className,
  itemClassName,
}: SocialLinksProps) {
  return (
    <div className={cn("flex items-center gap-5", className)}>
      {items.map((social) => {
        const Icon = BRAND_ICON[social.label];
        if (!Icon) return null;
        const glyphSize = size * (OPTICAL_SCALE[social.label] ?? 1);
        const nudgeY = NUDGE_Y[social.label];
        return (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "transition-all duration-300 hover:-translate-y-0.5",
              itemClassName
            )}
          >
            <Icon
              size={glyphSize}
              className="block"
              style={nudgeY ? { transform: `translateY(${nudgeY}px)` } : undefined}
              aria-hidden
            />
          </a>
        );
      })}
    </div>
  );
}
