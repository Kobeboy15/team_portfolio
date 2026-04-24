"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { ImageFrame } from "../ui/ImageFrame";

import { useHeroAboutImage } from "./HeroAboutImageContext";

const LG_MEDIA_QUERY = "(min-width: 1024px)";

export type HeroScrollImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onReady?: () => void;
};

export function HeroScrollImage({
  src,
  alt,
  className,
  priority = true,
  onReady,
}: HeroScrollImageProps) {
  const [isLgUp, setIsLgUp] = useState(false);
  const heroAbout = useHeroAboutImage();
  const hasReportedReady = useRef(false);

  const reportReady = useCallback(() => {
    if (hasReportedReady.current) return;
    hasReportedReady.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqLg = window.matchMedia(LG_MEDIA_QUERY);
    const sync = () => {
      setIsLgUp(mqLg.matches);
    };

    sync();

    mqLg.addEventListener("change", sync);
    return () => {
      mqLg.removeEventListener("change", sync);
    };
  }, []);

  if (isLgUp && heroAbout?.flightActive) {
    return (
      <HeroScrollImageFlightSlot
        src={src}
        alt={alt}
        className={className}
        priority={priority}
        onReady={reportReady}
        registerHeroSlot={heroAbout.registerHeroSlot}
      />
    );
  }

  return (
    <HeroStaticImage
      src={src}
      alt={alt}
      className={className}
      priority={priority}
      onReady={reportReady}
    />
  );
}

/**
 * lg+ flight: mirror the static hero ImageFrame layout (relative sizing, offsets) so the
 * fixed FlightLayer overlay matches; image is hidden — overlay paints the pixels.
 */
function HeroScrollImageFlightSlot({
  src,
  alt,
  className,
  priority,
  onReady,
  registerHeroSlot,
}: HeroScrollImageProps & {
  registerHeroSlot: (el: HTMLElement | null) => void;
}) {
  const setImageSlot = useCallback(
    (node: HTMLImageElement | null) => {
      registerHeroSlot(node);

      if (node?.complete && node.naturalWidth > 0) {
        onReady?.();
      }
    },
    [onReady, registerHeroSlot]
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
        onLoad={onReady}
        className={[className, "opacity-0"].filter(Boolean).join(" ")}
        priority={priority}
      />
    </motion.div>
  );
}

function HeroStaticImage({
  src,
  alt,
  className,
  priority,
  onReady,
}: HeroScrollImageProps) {
  const setImageSlot = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0) {
        onReady?.();
      }
    },
    [onReady]
  );

  return (
    <ImageFrame
      placement="hero"
      src={src}
      alt={alt}
      imageRef={setImageSlot}
      onLoad={onReady}
      className={className}
      priority={priority}
    />
  );
}
