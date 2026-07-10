import { cn } from "@shared/lib/cn";

// Fine paper grain (hanji speckle).
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

// Long directional strands to evoke mulberry (hanji) fibers.
const FIBER =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.009 0.4' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E\")";

type PaperTextureProps = {
  /** "hero" is pronounced (grain + fibers + vignette); "subtle" is a faint grain. */
  variant?: "hero" | "subtle";
  className?: string;
};

/**
 * Hanji-paper texture overlay. Absolutely positioned — drop it into any
 * `relative` container as the first child, keeping content above it.
 */
export function PaperTexture({ variant = "hero", className }: PaperTextureProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div
        className={variant === "hero" ? "absolute inset-0 opacity-[0.18] mix-blend-multiply" : "absolute inset-0 opacity-[0.05] mix-blend-multiply"}
        style={{ backgroundImage: GRAIN, backgroundSize: "300px 300px" }}
      />
      {variant === "hero" && (
        <>
          <div
            className="absolute inset-0 opacity-[0.10] mix-blend-multiply"
            style={{ backgroundImage: FIBER, backgroundSize: "600px 600px" }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_40%,transparent_55%,rgba(26,23,28,0.12)_100%)]" />
        </>
      )}
    </div>
  );
}
