import type { CSSProperties } from "react";
import { cn } from "@shared/lib/cn";
import { PaperTexture } from "./paper-texture";

type PlaceholderImageProps = {
  /** Caption shown in the placeholder (e.g. "대표 프로필 이미지"). */
  label?: string;
  /** CSS aspect-ratio, e.g. "16 / 9", "3 / 4". Defaults to 3 / 4. */
  ratio?: string;
  /** Tone of the placeholder fill. */
  tone?: "light" | "dark";
  /**
   * "sm" tightens the frame and drops the caption, for thumbnail-sized boxes
   * (admin list rows) where the full ornament would not fit. The fill and
   * texture stay identical, so a thumbnail still reads as the same placeholder
   * the public page shows.
   */
  size?: "md" | "sm";
  className?: string;
};

/**
 * Styled stand-in for imagery that is not yet supplied. Swap for next/image
 * once real assets arrive — the surrounding layout stays the same.
 */
export function PlaceholderImage({
  label = "IMAGE",
  ratio = "3 / 4",
  tone = "light",
  size = "md",
  className,
}: PlaceholderImageProps) {
  const compact = size === "sm";
  return (
    <div
      style={{ aspectRatio: ratio } as CSSProperties}
      className={cn(
        "group/ph relative flex items-center justify-center overflow-hidden",
        tone === "light"
          ? "bg-linear-to-br from-mauve/30 via-mauve/20 to-plum/15 text-ink/45"
          : "bg-linear-to-br from-white/10 to-white/3 text-paper/45",
        className
      )}
    >
      <PaperTexture variant="subtle" />
      {/* Inner hairline frame */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute border",
          compact ? "inset-1" : "inset-3",
          tone === "light" ? "border-ink/10" : "border-paper/10"
        )}
      />
      <span className="relative flex flex-col items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "rounded-full border",
            compact ? "h-3 w-3" : "h-6 w-6",
            tone === "light" ? "border-ink/25" : "border-paper/25"
          )}
        />
        {/* The caption needs room the thumbnail does not have; the fill and
            hairline frame alone still read as the same placeholder. */}
        {!compact && (
          <span className="px-4 text-center font-display text-[11px] font-medium uppercase tracking-[0.2em]">
            {label}
          </span>
        )}
      </span>
    </div>
  );
}
