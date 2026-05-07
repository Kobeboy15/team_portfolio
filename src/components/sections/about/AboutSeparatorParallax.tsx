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
import type { DesktopSeparatorTrackMetrics } from "./useDesktopSeparatorTrackMetrics";

type AboutSeparatorParallaxProps = {
  src: string;
  alt: string;
  orientation: "horizontal" | "vertical";
  /**
   * Optional scroll progress shared with a parent horizontal scroll section.
   * Only consumed when `orientation === "horizontal"` (horizontal parallax uses this value,
   * falling back to local progress from `useScroll` on `containerRef` when omitted).
   * When `orientation === "vertical"`, vertical parallax always uses that local progress only;
   * passing this prop has no effect.
   */
  scrollYProgress?: MotionValue<number>;
  totalScrollWidth?: number;
  desktopTrackMetrics?: DesktopSeparatorTrackMetrics;
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

type DesktopRange = { enter: number; midpoint: number; exit: number };

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function sanitizeDesktopRange(range: DesktopRange, eps: number): DesktopRange {
  const safeEps = Number.isFinite(eps) ? Math.max(1e-6, eps) : 1e-4;
  // Reserve headroom so the final `1` breakpoint stays strictly greater.
  const maxEnter = 1 - 3 * safeEps;
  const maxMidpoint = 1 - 2 * safeEps;
  const maxExit = 1 - safeEps;

  let enter = Math.min(clamp01(range.enter), maxEnter);
  enter = Math.max(enter, safeEps);
  let midpoint = Math.min(clamp01(range.midpoint), maxMidpoint);
  let exit = Math.min(clamp01(range.exit), maxExit);

  midpoint = Math.max(midpoint, enter + safeEps);
  exit = Math.max(exit, midpoint + safeEps);

  if (!(0 <= enter && enter < midpoint && midpoint < exit && exit < 1)) {
    // Fallback to evenly spaced values if the range collapses.
    enter = 0.25;
    midpoint = 0.5;
    exit = 0.75;

    enter = Math.min(clamp01(enter), maxEnter);
    midpoint = Math.min(clamp01(midpoint), maxMidpoint);
    exit = Math.min(clamp01(exit), maxExit);
    midpoint = Math.max(midpoint, enter + safeEps);
    exit = Math.max(exit, midpoint + safeEps);
  }

  // Final guard: never return non-monotonic values.
  if (!(0 <= enter && enter < midpoint && midpoint < exit && exit < 1)) {
    return { enter: 0.25, midpoint: 0.5, exit: 0.75 };
  }

  return { enter, midpoint, exit };
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
  const didWarnNonMonotonicDesktopRangeRef = useRef(false);
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

      const nextHeight = containerRef.current.offsetHeight;
      const nextViewportWidth = window.innerWidth;

      setContainerMetrics((current) => {
        if (current.height === nextHeight && current.viewportWidth === nextViewportWidth) {
          return current;
        }

        return {
          height: nextHeight,
          viewportWidth: nextViewportWidth,
        };
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
      return sanitizeDesktopRange({ enter: 0, midpoint: 0.5, exit: 1 }, 1e-4);
    }

    const enterScrollPx = offsetLeft - viewportWidth;
    const midpointScrollPx = offsetLeft + (width / 2) - (viewportWidth / 2);
    const exitScrollPx = offsetLeft + width;

    const enter = clamp01(enterScrollPx / totalScrollWidth);
    const midpoint = Math.max(enter, clamp01(midpointScrollPx / totalScrollWidth));
    const exit = Math.max(midpoint, clamp01(exitScrollPx / totalScrollWidth));

    const eps = Math.max(1e-4, 1 / (totalScrollWidth + 1));
    const sanitized = sanitizeDesktopRange({ enter, midpoint, exit }, eps);

    return {
      ...sanitized,
    };
  }, [containerMetrics, desktopTrackMetrics, totalScrollWidth]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (didWarnNonMonotonicDesktopRangeRef.current) return;

    const inputs = [0, desktopRange.enter, desktopRange.midpoint, desktopRange.exit, 1];
    const isStrict = inputs.every((value, index) => index === 0 || value > inputs[index - 1]);
    if (isStrict) return;

    didWarnNonMonotonicDesktopRangeRef.current = true;
    console.warn("[AboutSeparatorParallax] Non-monotonic desktopRange breakpoints", {
      totalScrollWidth,
      desktopRange,
      inputs,
    });
  }, [desktopRange, totalScrollWidth]);

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
