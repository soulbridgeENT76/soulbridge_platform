"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatNewsDate } from "@entities/news";
import { Container, PaperTexture } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { HERO_SLIDES } from "../model/slides";
import { HeroWordmark, HeroSocials, ScrollMouse } from "./hero-decor";

/**
 * Five full-screen banners stacked vertically. Scrolling reveals slide 1 → 5;
 * the fixed index on the right tracks the active banner and jumps to it on
 * click. Scroll-snap (scoped via `.hero-scroll` in globals.css) makes each
 * banner settle into view.
 */
export function HeroSlider() {
  const [active, setActive] = useState(0);
  // The scroll hint shows only while the view is settled on a slide; it fades
  // out the moment scrolling starts and fades back in once it stops.
  const [settled, setSettled] = useState(true);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(
              (entry.target as HTMLElement).dataset.index ?? 0
            );
            setActive(index);
          }
        }
      },
      { threshold: 0.5 }
    );
    const nodes = sectionRefs.current.filter(Boolean) as HTMLElement[];
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  // Background parallax: each section's bg layer drifts vertically based on how
  // far the section sits from the viewport center (rAF-throttled).
  useEffect(() => {
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>(".hero-scroll [data-parallax]")
    );
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      for (const layer of layers) {
        const section = layer.parentElement;
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        layer.style.transform = `translate3d(0, ${(progress * 60).toFixed(
          1
        )}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Hide the hint while actively scrolling; reveal it after the scroll settles.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      setSettled(false);
      clearTimeout(timer);
      timer = setTimeout(() => setSettled(true), 240);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollTo = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  const activeScheme = HERO_SLIDES[active].scheme;

  return (
    <div className="hero-scroll relative">
      {HERO_SLIDES.map((slide, i) => {
        const dark = slide.scheme === "dark";
        return (
          <section
            key={slide.id}
            data-index={i}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            style={{ backgroundColor: slide.bg }}
            className={cn(
              "hero-section relative flex min-h-svh items-center overflow-hidden",
              dark ? "text-ink" : "text-paper"
            )}
          >
            {/* Parallax background layer (oversized so it never reveals edges
                as it drifts). Holds the banner image when the slide has one,
                otherwise falls back to the paper texture + decorative wordmark
                over the slide's flat brand colour. */}
            <div
              data-parallax
              className="pointer-events-none absolute inset-x-0 top-[-8%] h-[116%] will-change-transform"
            >
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  // The banner is decorative and sits behind the copy.
                  aria-hidden
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover object-right"
                />
              ) : (
                <>
                  <PaperTexture />
                  {i === 0 && <HeroWordmark />}
                </>
              )}
            </div>
            <Container className="relative z-10 w-full py-24">
              <div
                className={cn(
                  // Each child reveals with a gentle upward fade as the slide
                  // becomes active; staggered so the block eases in top-to-bottom.
                  "max-w-3xl *:transition-all *:duration-700 *:ease-out",
                  "[&>*:nth-child(2)]:delay-100 [&>*:nth-child(3)]:delay-200 [&>*:nth-child(4)]:delay-300 [&>*:nth-child(5)]:delay-500",
                  i === active
                    ? "*:translate-y-0 *:opacity-100"
                    : "*:translate-y-8 *:opacity-0"
                )}
              >
                <p
                  className={cn(
                    "font-display text-xs font-semibold uppercase tracking-[0.25em]",
                    dark ? "text-ink/60" : "text-paper/60"
                  )}
                >
                  {slide.eyebrow}
                </p>

                {slide.titleEn && (
                  <p className="mt-6 font-display text-sm font-medium uppercase tracking-[0.18em] opacity-70">
                    {slide.titleEn}
                  </p>
                )}

                <h2 className="mt-10 font-sans text-3xl font-semibold leading-tight tracking-tight break-keep md:mt-14 md:text-5xl lg:text-6xl">
                  {slide.titleKo.split("\n").map((line, li) => (
                    <span
                      key={li}
                      className="block not-first:mt-2 md:not-first:mt-3.5"
                    >
                      {line}
                    </span>
                  ))}
                </h2>

                {slide.body && (
                  <p
                    className={cn(
                      "mt-10 whitespace-pre-line break-keep text-base font-medium leading-relaxed md:mt-14 md:text-lg",
                      dark ? "text-ink/70" : "text-paper/70"
                    )}
                  >
                    {slide.body}
                  </p>
                )}

                {slide.pills && (
                  <ul className="mt-10 flex flex-wrap gap-3 md:mt-14">
                    {slide.pills.map((pill) => (
                      <li
                        key={pill}
                        className={cn(
                          "rounded-full border px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.15em]",
                          dark ? "border-ink/25" : "border-paper/25"
                        )}
                      >
                        {pill}
                      </li>
                    ))}
                  </ul>
                )}

                {slide.news && (
                  <ul
                    className={cn(
                      "mt-10 max-w-xl border-t md:mt-14",
                      dark ? "border-ink/15" : "border-paper/15"
                    )}
                  >
                    {slide.news.map((item) => (
                      <li
                        key={item.slug}
                        className={cn(
                          "flex items-center gap-4 border-b py-3.5 md:gap-6",
                          dark ? "border-ink/15" : "border-paper/15"
                        )}
                      >
                        <span
                          className={cn(
                            "shrink-0 font-display text-xs font-semibold tracking-wider tabular-nums",
                            dark ? "text-ink/50" : "text-paper/50"
                          )}
                        >
                          {formatNewsDate(item.date)}
                        </span>
                        <span
                          className={cn(
                            "hidden shrink-0 font-display text-[10px] font-bold uppercase tracking-[0.15em] sm:inline",
                            dark ? "text-plum" : "text-paper/70"
                          )}
                        >
                          {item.category}
                        </span>
                        <span
                          className={cn(
                            "truncate text-sm font-medium md:text-base",
                            dark ? "text-ink/85" : "text-paper/85"
                          )}
                        >
                          {item.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  href={slide.cta.href}
                  className="group mt-14 inline-flex flex-col md:mt-20"
                >
                  <span className="flex origin-left items-center gap-3 font-display text-sm font-semibold uppercase tracking-[0.18em] transition-transform duration-300 group-hover:scale-105">
                    {slide.cta.label}
                    <ArrowRight
                      aria-hidden
                      size={26}
                      strokeWidth={1.75}
                      className="transition-transform duration-300 group-hover:translate-x-1.5"
                    />
                  </span>
                  {/* Underline spans exactly to the arrow; on hover a solid line
                      wipes in from the left instead of lengthening. */}
                  <span className="relative mt-3 block h-px w-[95%] overflow-hidden bg-ink/30">
                    <span className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </span>
                </Link>
              </div>
            </Container>

            {/* Hero-only decorations on the first banner */}
            {i === 0 && <HeroSocials />}
          </section>
        );
      })}

      {/* Fixed slide index (01–05) */}
      <nav
        aria-label="배너 바로가기"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 md:right-10 md:flex lg:right-16"
      >
        <span
          aria-hidden
          className={cn(
            "mb-2 h-14 w-0.5",
            // Brand purple over the light banners; falls back to paper on a
            // dark slide, where purple would disappear.
            activeScheme === "dark" ? "bg-brand" : "bg-paper/80"
          )}
        />
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`배너 ${i + 1}로 이동`}
            aria-current={i === active}
            onClick={() => scrollTo(i)}
            className={cn(
              "font-display text-xs font-semibold tracking-widest transition-all",
              activeScheme === "dark" ? "text-brand" : "text-paper",
              i === active
                ? "opacity-100"
                : "opacity-40 hover:opacity-70"
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </nav>

      {/* Persistent "scrollable" hint — stays at bottom center until the last
          slide (the bottom) is reached. */}
      <ScrollMouse
        className={cn(
          "fixed bottom-8 left-1/2 z-40 -translate-x-1/2 transition-opacity duration-500",
          activeScheme === "dark" ? "text-ink/70" : "text-paper/70",
          settled && active < HERO_SLIDES.length - 1
            ? "opacity-100"
            : "opacity-0"
        )}
      />
    </div>
  );
}
