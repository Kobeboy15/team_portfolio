"use client";

import { useCallback, useEffect, useMemo, useState, type RefObject } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { ImageFrame } from "../ui/ImageFrame";

import { useHeroAboutImage } from "./HeroAboutImageContext";

const SM_MEDIA_QUERY = "(min-width: 640px)";
const LG_MEDIA_QUERY = "(min-width: 1024px)";
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
  const [isLgUp, setIsLgUp] = useState(false);
  const heroAbout = useHeroAboutImage();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqSm = window.matchMedia(SM_MEDIA_QUERY);
    const mqLg = window.matchMedia(LG_MEDIA_QUERY);
    const sync = () => {
      setIsSmUp(mqSm.matches);
      setIsLgUp(mqLg.matches);
    };

    sync();

    mqSm.addEventListener("change", sync);
    mqLg.addEventListener("change", sync);
    return () => {
      mqSm.removeEventListener("change", sync);
      mqLg.removeEventListener("change", sync);
    };
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

  /**
   * lg+ flight: keep the same DOM + layout as HeroScrollImageDesktop (incl. relative/bottom
   * offsets) so the flying overlay matches the old overlap; image is hidden — overlay paints.
   */
  if (isLgUp && heroAbout?.flightActive) {
    return (
      <HeroScrollImageFlightSlot
        src={src}
        alt={alt}
        className={className}
        priority={priority}
        registerHeroSlot={heroAbout.registerHeroSlot}
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

function HeroScrollImageFlightSlot({
  src,
  alt,
  className,
  priority,
  registerHeroSlot,
}: HeroScrollImageProps & {
  registerHeroSlot: (el: HTMLElement | null) => void;
}) {
  const setImageSlot = useCallback(
    (node: HTMLImageElement | null) => {
      registerHeroSlot(node);
    },
    [registerHeroSlot]
  );

  return (
    <motion.div
      className="relative z-10 h-full w-full origin-bottom-left"
      style={{ scale: 1, pointerEvents: "none" }}
    >
      <ImageFrame
        placement="hero"
        src={src}
        alt={alt}
        imageRef={setImageSlot}
        className={`${className} opacity-0`.trim()}
        priority={priority}
      />
    </motion.div>
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
