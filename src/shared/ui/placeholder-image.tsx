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
  className,
}: PlaceholderImageProps) {
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
          "pointer-events-none absolute inset-3 border",
          tone === "light" ? "border-ink/10" : "border-paper/10"
        )}
      />
      <span className="relative flex flex-col items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "h-6 w-6 rounded-full border",
            tone === "light" ? "border-ink/25" : "border-paper/25"
          )}
        />
        <span className="px-4 text-center font-display text-[11px] font-medium uppercase tracking-[0.2em]">
          {label}
        </span>
      </span>
    </div>
  );
}
