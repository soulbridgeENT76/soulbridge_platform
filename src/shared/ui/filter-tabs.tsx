import { cn } from "@shared/lib/cn";

type FilterTabsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/**
 * Presentational segmented filter. State is owned by the parent (a client
 * feature), so this stays a simple controlled component.
 */
export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterTabsProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors",
            option === value
              ? "border-ink bg-ink text-paper"
              : "border-ink/20 text-ink/60 hover:border-ink/50 hover:text-ink"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
