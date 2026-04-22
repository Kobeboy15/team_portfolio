"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { Icon } from "@/src/types/skills";

type IconCarouselCardProps = {
  icons: Icon[];
  heading?: string;
  caption?: string;
  invertClass?: string;
};

const VISIBLE_ICON_COUNT = 3;
const ADVANCE_INTERVAL_MS = 2200;
const STEP_TRANSITION = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function IconCarouselCard({
  icons,
  heading,
  caption,
  invertClass = "",
}: IconCarouselCardProps) {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(viewportRef, { amount: 0.6 });
  const [offset, setOffset] = useState(0);

  const visibleCount = Math.min(VISIBLE_ICON_COUNT, icons.length);
  const shouldAnimate = icons.length > 1 && !reduceMotion;

  useEffect(() => {
    if (!shouldAnimate || !isInView) {
      return;
    }

    const interval = window.setInterval(() => {
      setOffset((currentOffset) => (currentOffset + 1) % icons.length);
    }, ADVANCE_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [icons.length, isInView, shouldAnimate]);

  const visibleIcons = getVisibleIcons(icons, offset, visibleCount);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-5 lg:py-5 gap-2 md:gap-3">
      <div
        ref={viewportRef}
        className="w-full flex flex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 py-1 sm:py-2 md:py-3"
      >
        {shouldAnimate
          ? visibleIcons.map((icon, index) => (
              <AnimatedIconSlot
                key={index}
                icon={icon}
                invertClass={invertClass}
              />
            ))
          : visibleIcons.map((icon, index) => (
              <IconTile
                key={`${icon.name}-${index}`}
                icon={icon}
                invertClass={invertClass}
              />
            ))}
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

function AnimatedIconSlot({
  icon,
  invertClass,
}: {
  icon: Icon;
  invertClass: string;
}) {
  return (
    <div className="relative min-w-0">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={icon.name}
          initial={{ x: "22%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-22%", opacity: 0 }}
          transition={STEP_TRANSITION}
        >
          <IconTile icon={icon} invertClass={invertClass} />
        </motion.div>
      </AnimatePresence>
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
