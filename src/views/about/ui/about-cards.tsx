"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@shared/lib/cn";

export type AboutCard = {
  /** Zero-padded index label, e.g. "01". */
  no: string;
  title: string;
  description: string;
};

type AboutCardsProps = {
  items: AboutCard[];
};

/**
 * Numbered business cards (index + title + description).
 * Up to 4 items lay out as a static responsive grid; beyond that they turn
 * into a horizontal carousel with ‹ › controls, so the CMS can keep adding
 * items without breaking the layout.
 */
export function AboutCards({ items }: AboutCardsProps) {
  if (items.length <= 4) {
    return (
      <div className={cn("grid grid-cols-1 gap-8", GRID_COLS[items.length])}>
        {items.map((card) => (
          <Card key={card.no} card={card} />
        ))}
      </div>
    );
  }
  return <AboutCardsCarousel items={items} />;
}

/** Column count follows the item count (1–4) so cards fill the row width
 *  instead of leaving a gap. Static strings so Tailwind can see them. */
const GRID_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

function Card({ card }: { card: AboutCard }) {
  return (
    <div className="border-t border-ink/15 pt-5">
      <span className="font-display text-xs font-semibold tracking-widest text-plum">
        {card.no}
      </span>
      <h3 className="mt-3 text-lg font-bold text-ink">{card.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">
        {card.description}
      </p>
    </div>
  );
}

function AboutCardsCarousel({ items }: AboutCardsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Advance by roughly one viewport of cards.
    el.scrollBy({ left: el.clientWidth * 0.85 * dir, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={sync}
        className="flex gap-8 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((card) => (
          <div
            key={card.no}
            className="w-[78%] shrink-0 sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-3*2rem)/4)]"
          >
            <Card card={card} />
          </div>
        ))}
      </div>

      <NavButton side="left" hidden={atStart} onClick={() => step(-1)} />
      <NavButton side="right" hidden={atEnd} onClick={() => step(1)} />
    </div>
  );
}

function NavButton({
  side,
  hidden,
  onClick,
}: {
  side: "left" | "right";
  hidden: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "이전" : "다음"}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center text-brand transition-all hover:scale-125",
        side === "left" ? "-left-7 md:-left-12" : "-right-7 md:-right-12",
        hidden && "pointer-events-none opacity-0"
      )}
    >
      {side === "left" ? (
        <ChevronLeft size={30} strokeWidth={1.2} className="scale-y-[2.6]" />
      ) : (
        <ChevronRight size={30} strokeWidth={1.2} className="scale-y-[2.6]" />
      )}
    </button>
  );
}
