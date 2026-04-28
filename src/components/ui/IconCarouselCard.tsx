"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { Icon } from "@/src/types/skills";

type IconCarouselCardProps = {
  icons: Icon[];
  heading?: string;
  caption?: string;
  invertClass?: string;
};

type SlotMeasurement = {
  left: number;
  width: number;
};

const VISIBLE_ICON_COUNT = 3;
const ADVANCE_INTERVAL_MS = 2200;
const STEP_DURATION_S = 0.58;
const STEP_EASE = [0.22, 1, 0.36, 1] as const;

export function IconCarouselCard({
  icons,
  heading,
  caption,
  invertClass = "",
}: IconCarouselCardProps) {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const measureRowRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(viewportRef, { amount: 0.6 });
  const shiftX = useMotionValue(0);

  const [offset, setOffset] = useState(0);
  const [slots, setSlots] = useState<SlotMeasurement[]>([]);
  const [rowHeight, setRowHeight] = useState(0);
  const [stepWidth, setStepWidth] = useState(0);

  const visibleCount = Math.min(VISIBLE_ICON_COUNT, icons.length);
  const shouldAnimate = icons.length > 1 && !reduceMotion;
  const visibleIcons = getVisibleIcons(icons, offset, visibleCount);
  const overlayIcons = shouldAnimate
    ? [
        icons[offset % icons.length],
        icons[(offset + 1) % icons.length],
        icons[(offset + 2) % icons.length],
        icons[(offset + 3) % icons.length],
      ]
    : [];

  useLayoutEffect(() => {
    const row = measureRowRef.current;
    if (!row) {
      return;
    }

    const measure = () => {
      const children = Array.from(row.children) as HTMLElement[];
      if (children.length === 0) {
        setSlots([]);
        setRowHeight(0);
        setStepWidth(0);
        return;
      }

      const nextSlots = children.map((child) => ({
        left: child.offsetLeft,
        width: child.offsetWidth,
      }));

      setSlots(nextSlots);
      setRowHeight(row.offsetHeight);

      if (nextSlots.length > 1) {
        setStepWidth(nextSlots[1].left - nextSlots[0].left);
      } else {
        setStepWidth(nextSlots[0].width);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(() => {
      measure();
    });

    resizeObserver.observe(row);
    Array.from(row.children).forEach((child) => resizeObserver.observe(child));

    return () => {
      resizeObserver.disconnect();
    };
  }, [visibleCount, icons.length]);

  useEffect(() => {
    if (!shouldAnimate || !isInView || stepWidth <= 0 || slots.length < visibleCount) {
      return;
    }

    let cancelled = false;
    let controls: ReturnType<typeof animate> | undefined;

    const timeoutId = window.setTimeout(() => {
      controls = animate(shiftX, -stepWidth, {
        duration: STEP_DURATION_S,
        ease: STEP_EASE,
      });

      controls.then(() => {
        if (cancelled) {
          return;
        }

        shiftX.set(0);
        setOffset((currentOffset) => (currentOffset + 1) % icons.length);
      });
    }, ADVANCE_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controls?.stop();
    };
  }, [icons.length, isInView, offset, shiftX, shouldAnimate, slots.length, stepWidth, visibleCount]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-5 lg:py-5 gap-2 md:gap-3">
      <div
        ref={viewportRef}
        className="w-full flex flex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 py-1 sm:py-2 md:py-3"
      >
        {shouldAnimate ? (
          <div className="relative">
            <div
              ref={measureRowRef}
              aria-hidden="true"
              className="invisible flex flex-row items-center gap-2 sm:gap-3 md:gap-4"
            >
              {visibleIcons.map((icon, index) => (
                <div
                  key={`measure-${index}`}
                  className="relative"
                >
                  <IconTile icon={icon} invertClass={invertClass} />
                </div>
              ))}
            </div>

            {slots.length === visibleCount && rowHeight > 0 && (
              <div
                className="absolute inset-x-0 top-0 overflow-x-hidden overflow-y-visible"
                style={{ height: rowHeight }}
              >
                {overlayIcons.map((icon, index) => {
                  const slotIndex = Math.min(index, visibleCount - 1);
                  const baseLeft =
                    index < visibleCount
                      ? slots[slotIndex]?.left ?? 0
                      : (slots[visibleCount - 1]?.left ?? 0) + stepWidth;

                  const width = slots[slotIndex]?.width ?? slots[visibleCount - 1]?.width ?? undefined;

                  return (
                    <motion.div
                      key={`overlay-${offset}-${icon.name}-${index}`}
                      className="absolute top-0"
                      style={{
                        left: baseLeft,
                        width,
                        x: shiftX,
                      }}
                    >
                      <IconTile icon={icon} invertClass={invertClass} />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          visibleIcons.map((icon, index) => (
            <IconTile
              key={`${icon.name}-${index}`}
              icon={icon}
              invertClass={invertClass}
            />
          ))
        )}
      </div>
      {(heading || caption) && (
        <div className="font-sora flex flex-col w-full px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-5 lg:py-5 gap-2 md:gap-3 text-sm md:text-base lg:text-lg">
          {heading && <h3 className="text-(--token-accent)">{heading}</h3>}
          {caption && <p className="text-(--token-foreground)">{caption}</p>}
        </div>
      )}
    </div>
  );
}

function IconTile({
  icon,
  invertClass,
}: {
  icon: Icon;
  invertClass: string;
}) {
  return (
    <div
      className="overflow-hidden rounded-[10px] px-3 py-3 sm:px-4 sm:py-4 md:p-5 lg:p-7"
      style={{
        background:
          "linear-gradient(to bottom, var(--token-background) 50%, var(--token-background-2) 100%)",
      }}
    >
      <img
        src={icon.path}
        alt={icon.name}
        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 ${invertClass}`}
      />
    </div>
  );
}

function getVisibleIcons(icons: Icon[], offset: number, count: number): Icon[] {
  if (icons.length === 0 || count === 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    return icons[(offset + index) % icons.length];
  });
}
