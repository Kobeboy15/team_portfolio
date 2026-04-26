import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

import { AboutSeparatorParallax } from "./AboutSeparatorParallax";

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
  const [desktopTrackMetrics, setDesktopTrackMetrics] = useState({
    offsetLeft: 0,
    width: 0,
  });

  useEffect(() => {
    if (orientation !== "horizontal") return;

    const measure = () => {
      if (!sectionRef.current) return;

      setDesktopTrackMetrics({
        offsetLeft: sectionRef.current.offsetLeft,
        width: sectionRef.current.offsetWidth,
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    const scrollContainer = sectionRef.current?.closest<HTMLElement>("[data-scroll-container]");
    if (scrollContainer) resizeObserver.observe(scrollContainer);
    if (sectionRef.current) resizeObserver.observe(sectionRef.current);

    window.addEventListener("resize", measure);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [orientation]);

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
