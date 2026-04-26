"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { ImageFrame } from "../../ui/ImageFrame";

type AboutSeparatorParallaxProps = {
  src: string;
  alt: string;
  orientation: "horizontal" | "vertical";
  scrollYProgress?: MotionValue<number>;
  totalScrollWidth?: number;
  desktopTrackMetrics?: {
    offsetLeft: number;
    width: number;
  };
};

const MAX_TRAVEL_PX = 132;
const DESKTOP_TRAVEL_RATIO = 0.14;
const MOBILE_TRAVEL_RATIO = 0.28;
const MIN_DESKTOP_TRAVEL_PX = 52;
const MIN_MOBILE_TRAVEL_PX = 84;
const DESKTOP_OVERSCAN_PERCENT = 22;
const MOBILE_OVERSCAN_PERCENT = 34;

function clampTravel(size: number, minTravel: number, ratio: number) {
  return Math.min(MAX_TRAVEL_PX, Math.max(minTravel, size * ratio));
}

export function AboutSeparatorParallax({
  src,
  alt,
  orientation,
  scrollYProgress,
  totalScrollWidth = 0,
  desktopTrackMetrics,
}: AboutSeparatorParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [containerMetrics, setContainerMetrics] = useState({
    height: 0,
    viewportWidth: 0,
  });

  const { scrollYProgress: localScrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;

      setContainerMetrics({
        height: containerRef.current.offsetHeight,
        viewportWidth: window.innerWidth,
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    window.addEventListener("resize", measure);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [orientation]);

  const desktopTravel = clampTravel(
    desktopTrackMetrics?.width ?? 0,
    MIN_DESKTOP_TRAVEL_PX,
    DESKTOP_TRAVEL_RATIO,
  );
  const mobileTravel = clampTravel(
    containerMetrics.height,
    MIN_MOBILE_TRAVEL_PX,
    MOBILE_TRAVEL_RATIO,
  );

  const desktopRange = useMemo(() => {
    const { viewportWidth } = containerMetrics;
    const offsetLeft = desktopTrackMetrics?.offsetLeft ?? 0;
    const width = desktopTrackMetrics?.width ?? 0;
    if (totalScrollWidth <= 0 || width <= 0 || viewportWidth <= 0) {
      return { enter: 0, midpoint: 0.5, exit: 1 };
    }

    const enterScrollPx = offsetLeft - viewportWidth;
    const midpointScrollPx = offsetLeft + (width / 2) - (viewportWidth / 2);
    const exitScrollPx = offsetLeft + width;

    const enter = Math.min(1, Math.max(0, enterScrollPx / totalScrollWidth));
    const midpoint = Math.min(1, Math.max(enter, midpointScrollPx / totalScrollWidth));
    const exit = Math.min(1, Math.max(midpoint, exitScrollPx / totalScrollWidth));

    return {
      enter,
      midpoint,
      exit,
    };
  }, [containerMetrics, desktopTrackMetrics, totalScrollWidth]);

  const desktopX = useTransform(
    scrollYProgress ?? localScrollYProgress,
    [0, desktopRange.enter, desktopRange.midpoint, desktopRange.exit, 1],
    [-desktopTravel, -desktopTravel, 0, desktopTravel, desktopTravel],
  );
  const mobileY = useTransform(localScrollYProgress, [0, 0.5, 1], [-mobileTravel, 0, mobileTravel]);

  const desktopInset = `-${DESKTOP_OVERSCAN_PERCENT}%`;
  const desktopSize = `${100 + (DESKTOP_OVERSCAN_PERCENT * 2)}%`;
  const mobileInset = `-${MOBILE_OVERSCAN_PERCENT}%`;
  const mobileSize = `${100 + (MOBILE_OVERSCAN_PERCENT * 2)}%`;
  const movingLayerStyle =
    orientation === "horizontal"
      ? {
          left: desktopInset,
          top: 0,
          width: desktopSize,
          height: "100%",
          ...(prefersReducedMotion ? {} : { x: desktopX }),
        }
      : {
          left: 0,
          top: mobileInset,
          width: "100%",
          height: mobileSize,
          ...(prefersReducedMotion ? {} : { y: mobileY }),
        };

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <motion.div style={movingLayerStyle} className="absolute will-change-transform">
        <div className="relative h-full w-full">
          <ImageFrame placement="about-gallery-hero" src={src} alt={alt} />
        </div>
      </motion.div>
    </div>
  );
}
