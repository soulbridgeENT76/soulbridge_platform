import type { CSSProperties } from "react";
import { Instagram, Youtube, MessageSquare } from "lucide-react";
import { SOCIALS } from "@shared/config/site";
import { cn } from "@shared/lib/cn";

const SOCIAL_ICONS: Record<string, typeof Instagram> = {
  INSTAGRAM: Instagram,
  YOUTUBE: Youtube,
  KAKAO: MessageSquare,
};

const WORDMARK_FONT: CSSProperties = {
  fontFamily: "var(--font-archivo), Archivo, sans-serif",
  fontWeight: 900,
  letterSpacing: "-0.03em",
};

/**
 * Large brand wordmark with a wet spot-UV varnish look, produced entirely with
 * an SVG lighting filter (feSpecularLighting) — real specular highlights on a
 * dark tone-on-tone fill, no external image needed.
 */
export function HeroWordmark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 hidden select-none items-center pr-16 md:flex lg:pr-28"
    >
      <svg
        viewBox="-580 0 1500 600"
        className="h-auto w-[68rem] lg:w-[90rem]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="wm-wet" x="-15%" y="-15%" width="130%" height="130%">
            {/* Height map from the glyph alpha */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            {/* Thin glossy edge highlights (clear-varnish catching light) */}
            <feSpecularLighting
              in="blur"
              surfaceScale="6"
              specularConstant="1.25"
              specularExponent="30"
              lightingColor="#ffffff"
              result="spec"
            >
              <fePointLight x="180" y="-120" z="140" />
            </feSpecularLighting>
            <feComposite
              in="spec"
              in2="SourceAlpha"
              operator="in"
              result="specClip"
            />
            {/* Faint tone-on-tone glyph + glossy edges on top */}
            <feComposite
              in="specClip"
              in2="SourceGraphic"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
            />
          </filter>
        </defs>
        {/* Fill barely darker than the mauve paper so the grain shows through */}
        <g filter="url(#wm-wet)" fill="#1A171C" fillOpacity="0.16">
          <text x="910" y="250" textAnchor="end" fontSize="300" style={WORDMARK_FONT}>
            Soul
          </text>
          <text x="910" y="540" textAnchor="end" fontSize="300" style={WORDMARK_FONT}>
            Bridge
            <tspan fontSize="150" dx="12">
              ENT
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  );
}

/** Social links pinned to the bottom-left of the hero. */
export function HeroSocials() {
  return (
    <div className="absolute bottom-8 left-6 flex items-center gap-5 md:left-10 lg:left-16">
      {SOCIALS.map((s) => {
        const Icon = SOCIAL_ICONS[s.label] ?? MessageSquare;
        return (
          <a
            key={s.label}
            href={s.href}
            aria-label={s.label}
            className="text-ink/70 transition-colors hover:text-ink"
          >
            <Icon size={20} strokeWidth={1.75} />
          </a>
        );
      })}
    </div>
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
