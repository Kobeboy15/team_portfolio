"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { ImageFrame } from "../../ui/ImageFrame";

const LG_MEDIA_QUERY = "(min-width: 1024px)";

/** Spring config — same feel as hero shrink (tune here). */
const SCALE_SPRING = { stiffness: 160, damping: 28 };

const POINTER_NONE_THRESHOLD = 0.03;

export type AboutBioProfileImageProps = {
  imageRevealProgress?: MotionValue<number>;
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
};

export function AboutBioProfileImage({
  imageRevealProgress,
  src,
  alt,
  sizes,
  className,
}: AboutBioProfileImageProps) {
  const [isLgUp, setIsLgUp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(LG_MEDIA_QUERY);
    const sync = () => setIsLgUp(mediaQuery.matches);

    sync();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", sync);
      return () => mediaQuery.removeEventListener("change", sync);
    }

    mediaQuery.addListener(sync);
    return () => mediaQuery.removeListener(sync);
  }, []);

  if (!isLgUp || !imageRevealProgress) {
    return (
      <ImageFrame
        placement="about"
        src={src}
        alt={alt}
        sizes={sizes}
        className={className}
      />
    );
  }

  return (
    <AboutBioProfileImageDesktop
      imageRevealProgress={imageRevealProgress}
      src={src}
      alt={alt}
      sizes={sizes}
      className={className}
    />
  );
}

function AboutBioProfileImageDesktop({
  imageRevealProgress,
  src,
  alt,
  sizes,
  className,
}: Required<Pick<AboutBioProfileImageProps, "imageRevealProgress">> &
  Omit<AboutBioProfileImageProps, "imageRevealProgress">) {
  const reduceMotion = useReducedMotion();

  const scaleRaw = useTransform(imageRevealProgress, [0, 1], [0, 1]);
  const scale = useSpring(scaleRaw, SCALE_SPRING);
  const pointerEvents = useTransform(scale, (s) =>
    s < POINTER_NONE_THRESHOLD ? "none" : "auto"
  );

  return (
    <motion.div
      className="h-full w-full origin-top-right"
      style={{
        scale: reduceMotion ? 1 : scale,
        pointerEvents: reduceMotion ? "auto" : pointerEvents,
      }}
    >
      <ImageFrame
        placement="about"
        src={src}
        alt={alt}
        sizes={sizes}
        className={className}
      />
    </motion.div>
  );
}
