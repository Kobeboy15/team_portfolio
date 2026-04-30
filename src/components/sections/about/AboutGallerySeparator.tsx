import { useRef } from "react";
import type { MotionValue } from "framer-motion";

import { AboutSeparatorParallax } from "./AboutSeparatorParallax";
import { useDesktopSeparatorTrackMetrics } from "./useDesktopSeparatorTrackMetrics";

type AboutGallerySeparatorProps = {
  src: string;
  alt: string;
  orientation?: "horizontal" | "vertical";
  useStableMobileMediaHeight?: boolean;
  scrollYProgress?: MotionValue<number>;
  totalScrollWidth?: number;
};

export function AboutGallerySeparator({
  src,
  alt,
  orientation = "horizontal",
  useStableMobileMediaHeight = false,
  scrollYProgress,
  totalScrollWidth = 0,
}: AboutGallerySeparatorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopTrackMetrics = useDesktopSeparatorTrackMetrics(
    sectionRef,
    orientation === "horizontal",
  );

  const mobileHeightClass = useStableMobileMediaHeight
    ? "relative h-[clamp(320px,70svh,960px)] w-full overflow-hidden"
    : "relative h-[clamp(320px,70dvh,960px)] w-full overflow-hidden";

  return (
    <section
      ref={sectionRef}
      className={
        orientation === "vertical"
          ? mobileHeightClass
          : "relative h-dvh w-[70vw] shrink-0 overflow-hidden"
      }
      aria-label={alt}
    >
      <AboutSeparatorParallax
        src={src}
        alt={alt}
        orientation={orientation}
        scrollYProgress={scrollYProgress}
        totalScrollWidth={totalScrollWidth}
        desktopTrackMetrics={orientation === "horizontal" ? desktopTrackMetrics : undefined}
      />
    </section>
  );
}
