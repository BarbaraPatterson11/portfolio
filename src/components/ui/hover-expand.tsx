import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "../../lib/utils";
import { useViewport } from "../../hooks/useViewport";

export interface HoverExpandItem {
  label: string;
  /** e.g. country, year, category */
  sublabel?: string;
  image?: string;
  /** Zero-based horizontal band used to focus the shared vertical panorama. */
  panoramaSlice?: number;
  imageAlt?: string;
  /** short descriptor shown when expanded */
  description?: string;
  /** readable chips shown over the expanded panel */
  detailTags?: string[];
}

export interface HoverExpandProps {
  items: HoverExpandItem[];
  /**
   * Row height when collapsed, in pixels.
   * @default 68
   */
  collapsedHeight?: number;
  /**
   * Row height when expanded, in pixels.
   * @default 320
   */
  expandedHeight?: number;
  className?: string;
}

export function HoverExpand({
  items,
  collapsedHeight = 68,
  expandedHeight = 320,
  className,
}: HoverExpandProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [hasFinePointer, setHasFinePointer] = React.useState(false);
  // Canvas units, so the row heights below stay in the same design space as the
  // rest of the page instead of tracking raw screen pixels.
  const { mode, stageHeight } = useViewport();
  const canHover = mode === "desktop" && hasFinePointer;
  const shortTouchViewport = !canHover && stageHeight < 720;
  const compactRowHeight = Math.min(collapsedHeight, shortTouchViewport ? 52 : 60);
  // The skills accordion now contains longer descriptions and ten-to-eleven
  // tags per panel. Keep the section-provided expanded height on touch layouts
  // so the last badge row is never clipped by a compact mobile cap.
  const compactExpandedHeight = expandedHeight;

  React.useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHasFinePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  if (mode === "mobile") {
    return (
      <div className={cn("skills-mobile-accordion w-full", className)}>
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const panelId = `mobile-skill-${index}`;
          return (
            <div key={item.label} className={`skills-mobile-row${isActive ? ' is-active' : ''}`}>
              <button
                type="button"
                className="skills-mobile-trigger"
                onClick={() => setActiveIndex(current => current === index ? null : index)}
                aria-expanded={isActive}
                aria-controls={panelId}
              >
                <span className="skills-mobile-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="skills-mobile-label">{item.label}</span>
                <span className="skills-mobile-toggle" aria-hidden="true">{isActive ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="skills-mobile-detail">
                      <p className="skills-mobile-sublabel">{item.sublabel ?? 'Core capability'}</p>
                      <p className="skills-mobile-description">{item.description}</p>
                      <ul className="skills-mobile-tags">
                        {item.detailTags?.map(tag => (
                          <li key={tag}><span aria-hidden="true">◇</span><span>{tag}</span></li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    );
  }

  const rowHeight = canHover ? collapsedHeight : compactRowHeight;
  const openHeight = canHover ? expandedHeight : compactExpandedHeight;
  // Keep the collapsed list close to the section heading. The old offset was
  // based on the expanded panel height, which left a large empty band above
  // all eight rows before any accordion item was opened.
  const revealOffset = activeIndex === null
    ? 0
    : Math.max(0, (openHeight - rowHeight) / 2);
  const openTotalHeight = openHeight + (items.length - 1) * rowHeight;
  const closedTotalHeight = items.length * rowHeight;
  const totalHeight = activeIndex === null ? closedTotalHeight : openTotalHeight;
  return (
    <motion.div
      className={cn("relative w-full overflow-hidden text-white/80 [overflow-anchor:none]", className)}
      initial={false}
      animate={{ height: totalHeight }}
      transition={{ type: "spring", stiffness: 250, damping: 32, mass: 0.9 }}
      onMouseLeave={() => canHover && setActiveIndex(null)}
    >
      {items.map((item, i) => {
        const isActive = activeIndex === i;
        const isOtherActive = activeIndex !== null && !isActive;
        const splitActiveTop = activeIndex === null
          ? 0
          : Math.max(0, Math.min(activeIndex * rowHeight, totalHeight - openHeight));
        const itemTop = activeIndex === null
          ? revealOffset + i * rowHeight
          : i < activeIndex
            ? splitActiveTop - (activeIndex - i) * rowHeight
            : i > activeIndex
              ? splitActiveTop + openHeight + (i - activeIndex - 1) * rowHeight
              : splitActiveTop;

        return (
          <motion.button
            key={item.label}
            type="button"
            className={cn(
              "absolute left-0 w-full overflow-hidden border-t border-white/10 text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-inset",
              isActive ? "bg-white/[0.02]" : "bg-transparent hover:bg-white/[0.01]",
              i === items.length - 1 && "border-b",
            )}
            style={{ height: isActive ? openHeight : rowHeight }}
            animate={{
              y: itemTop,
              height: isActive ? openHeight : rowHeight,
              opacity: isOtherActive ? 0.48 : 1,
            }}
            transition={{
              y: {
                type: "spring",
                stiffness: 250,
                damping: 30,
                mass: 0.95,
              },
              height: {
                type: "spring",
                stiffness: 250,
                damping: 30,
                mass: 0.95,
              },
              opacity: { duration: 0.22, ease: "easeOut" },
            }}
            onMouseEnter={() => canHover && setActiveIndex(i)}
            onClick={() => setActiveIndex((current) => current === i ? null : i)}
            aria-expanded={isActive}
          >

            <div className="absolute inset-x-0 top-0 flex items-center px-3 sm:px-6 md:px-8" style={{ height: rowHeight }}>
              <div className="flex w-full items-center justify-between gap-5">
                <div className="flex min-w-0 items-center gap-3 md:gap-4">
                  <motion.span
                    className="shrink-0 font-mono text-xs tracking-[0.2em]"
                    animate={{
                      color: isActive
                        ? "rgba(255,255,255,0.58)"
                        : "currentColor",
                      opacity: isActive ? 1 : 0.38,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </motion.span>

                  <span
                    aria-hidden="true"
                    className="h-8 w-[1px] shrink-0 bg-white/20 md:h-9"
                  />

                  <motion.span
                    className="min-w-0 font-display text-[clamp(1.05rem,calc(4.6*var(--vw)),2.15rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em]"
                    animate={{
                      color: isActive ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.84)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>

                </div>

                <div className="flex shrink-0 items-center gap-4">
                  {item.sublabel && (
                  <motion.span
                    className="hidden shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.2em] md:block"
                    animate={{
                      color: isActive
                        ? "rgba(255,255,255,0.64)"
                        : "currentColor",
                      opacity: isActive ? 1 : 0.42,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.sublabel}
                  </motion.span>
                  )}
                  <motion.span
                    animate={{ color: isActive ? "#ffffff" : "currentColor", opacity: isActive ? 0.8 : 0.42 }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center font-sans text-[25px] font-light leading-none text-white/70">
                      {isActive ? '−' : '+'}
                    </span>
                  </motion.span>
                </div>
              </div>
            </div>

            {(item.description || item.detailTags) && (
              <motion.div
                className="pointer-events-none absolute left-4 right-4 max-w-[46rem] sm:left-14 sm:right-auto md:left-20"
                style={{ top: rowHeight + 12 }}
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                transition={{ duration: 0.3, delay: isActive ? 0.08 : 0, ease: [0.23, 1, 0.32, 1] }}
              >
                {item.description && (
                  <div>
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.24em] text-white/50 sm:text-xs">
                      Core capability
                    </span>
                    <p className="font-body text-sm font-normal leading-relaxed tracking-[-0.02em] text-white/70 sm:text-base">
                      {item.description}
                    </p>
                  </div>
                )}

                {item.detailTags && (
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:mt-6 sm:gap-x-6 sm:gap-y-3">
                    {item.detailTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 sm:text-xs"
                      >
                        <span className="text-[12px] text-white/60" aria-hidden="true">◇</span>
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
