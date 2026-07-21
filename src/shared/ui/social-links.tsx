import { SOCIAL_META, type SocialLink } from "@shared/config/socials";
import { cn } from "@shared/lib/cn";

type SocialLinksProps = {
  items: readonly SocialLink[];
  /** Icon size in px. */
  size?: number;
  /** Classes for the wrapping row (e.g. gap / justify). */
  className?: string;
  /** Classes for each icon link (e.g. color / hover). */
  itemClassName?: string;
};

/**
 * Row of social links rendered as official brand icons.
 *
 * Items carry a SocialKey and are looked up in SOCIAL_META, so the brand
 * chrome and an artist profile render from the same registry — a network added
 * there appears in both with no change here.
 */
export function SocialLinks({
  items,
  size = 20,
  className,
  itemClassName,
}: SocialLinksProps) {
  // Every network can be left blank, so an empty row is normal — render
  // nothing rather than an empty flex box that still eats its parent's gap.
  if (items.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-5", className)}>
      {items.map((social) => {
        const meta = SOCIAL_META[social.key];
        if (!meta) return null;
        const { label, Icon, opticalScale, nudgeY } = meta;
        return (
          <a
            key={social.key}
            href={social.href}
            aria-label={label}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "transition-all duration-300 hover:-translate-y-0.5",
              itemClassName
            )}
          >
            <Icon
              size={size * (opticalScale ?? 1)}
              className="block"
              style={
                nudgeY ? { transform: `translateY(${nudgeY}px)` } : undefined
              }
              aria-hidden
            />
          </a>
        );
      })}
    </div>
  );
}
