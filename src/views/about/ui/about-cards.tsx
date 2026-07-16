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
 * Numbered business cards. Always a horizontal, swipeable carousel on mobile
 * (only ~1 card fits), and a full-width grid on desktop where the cards fill
 * the row by count. When more cards than fit exist, the ‹ › controls appear.
 *
 * Card width per breakpoint is chosen so N (≤4) cards fill the row exactly;
 * extra cards overflow and become scrollable.
 */
const CARD_WIDTH: Record<number, string> = {
  1: "w-full",
  2: "w-[82%] sm:w-[calc((100%-2rem)/2)]",
  3: "w-[82%] sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]",
  4: "w-[82%] sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-6rem)/4)]",
};

export function AboutCards({ items }: AboutCardsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // 1–4 sets how wide each card is on desktop; 5+ reuse the 4-up width and scroll.
  const columns = Math.min(Math.max(items.length, 1), 4);

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
    el.scrollBy({ left: el.clientWidth * 0.85 * dir, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={sync}
        className="flex snap-x snap-mandatory gap-8 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((card) => (
          <div
            key={card.no}
            className={cn("shrink-0 snap-start", CARD_WIDTH[columns])}
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

function Card({ card }: { card: AboutCard }) {
  return (
    <div className="border-t border-ink/15 pt-5">
      <span className="font-display text-xs font-semibold tracking-widest text-plum">
        {card.no}
      </span>
      <h3 className="mt-3 text-lg font-bold text-ink">{card.title}</h3>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/65">
        {card.description}
      </p>
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
