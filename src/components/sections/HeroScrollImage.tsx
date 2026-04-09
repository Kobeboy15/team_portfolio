"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { ImageFrame } from "../ui/ImageFrame";

const SM_MEDIA_QUERY = "(min-width: 640px)";
const HERO_SECTION_ID = "hero";

/** Spring on scroll-mapped scale — moderate response, slight ease (tune here). */
const SCALE_SPRING = { stiffness: 160, damping: 28 };

const POINTER_NONE_THRESHOLD = 0.03;

export type HeroScrollImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function HeroScrollImage({
  src,
  alt,
  className,
  priority = true,
}: HeroScrollImageProps) {
  const [isSmUp, setIsSmUp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(SM_MEDIA_QUERY);
    const sync = () => setIsSmUp(mediaQuery.matches);

    sync();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", sync);
      return () => mediaQuery.removeEventListener("change", sync);
    }

    mediaQuery.addListener(sync);
    return () => mediaQuery.removeListener(sync);
  }, []);

  if (!isSmUp) {
    return (
      <ImageFrame
        placement="hero"
        src={src}
        alt={alt}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <HeroScrollImageDesktop
      src={src}
      alt={alt}
      className={className}
      priority={priority}
    />
  );
}

function HeroScrollImageDesktop({
  src,
  alt,
  className,
  priority = true,
}: HeroScrollImageProps) {
  const reduceMotion = useReducedMotion();

  // Stable ref with target resolved once on mount (client-only subtree).
  const heroSectionRef = useMemo<RefObject<HTMLElement | null>>(() => {
    const el =
      typeof document !== "undefined"
        ? document.getElementById(HERO_SECTION_ID)
        : null;
    return { current: el };
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"],
  });

  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useSpring(scaleRaw, SCALE_SPRING);
  const pointerEvents = useTransform(scale, (s) =>
    s < POINTER_NONE_THRESHOLD ? "none" : "auto"
  );

  return (
    <motion.div
      className="relative z-10 h-full w-full origin-bottom-left"
      style={{
        scale: reduceMotion ? 1 : scale,
        pointerEvents: reduceMotion ? "auto" : pointerEvents,
      }}
    >
      <ImageFrame
        placement="hero"
        src={src}
        alt={alt}
        className={className}
        priority={priority}
      />
    </motion.div>
  );
}
