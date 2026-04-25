"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll } from "framer-motion";

import type { Project } from "../../types/projects";
import { useSmoothScroll } from "../ui/SmoothScrollProvider";

import { ProjectCardDesktop } from "./ProjectCardDesktop";
import { projectCardDesktopTransition } from "./projectCardDesktopMotion";

const NAV_OFFSET_PX = 72;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const WHEEL_DELTA_THRESHOLD = 18;
const SNAP_LOCK_FALLBACK_MS = Math.round(projectCardDesktopTransition.duration * 1000) + 500;

export type DesktopStickyProjectsProps = {
  projects: Project[];
};

type SectionMetrics = {
  sectionStart: number;
  stickyEnd: number;
  viewportHeight: number;
};

function clampIndex(index: number, count: number) {
  return Math.min(count - 1, Math.max(0, index));
}

function getProgressIndex(progress: number, count: number) {
  return clampIndex(Math.floor(progress * count), count);
}

function getSectionMetrics(element: HTMLDivElement, count: number): SectionMetrics {
  const rect = element.getBoundingClientRect();
  const sectionStart = window.scrollY + rect.top;
  const viewportHeight = window.innerHeight;

  return {
    sectionStart,
    stickyEnd: sectionStart + Math.max(0, count - 1) * viewportHeight,
    viewportHeight,
  };
}

function getTargetScrollY(metrics: SectionMetrics, index: number) {
  return metrics.sectionStart + index * metrics.viewportHeight;
}

function getNearestProjectIndex(scrollY: number, metrics: SectionMetrics, count: number) {
  const rawIndex = Math.round((scrollY - metrics.sectionStart) / metrics.viewportHeight);
  return clampIndex(rawIndex, count);
}

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleCurveY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleCurveDerivativeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const currentX = sampleCurveX(t) - x;
      if (Math.abs(currentX) < 1e-6) {
        return sampleCurveY(t);
      }

      const derivative = sampleCurveDerivativeX(t);
      if (Math.abs(derivative) < 1e-6) {
        break;
      }

      t -= currentX / derivative;
    }

    let lower = 0;
    let upper = 1;
    t = x;

    while (lower < upper) {
      const currentX = sampleCurveX(t);
      if (Math.abs(currentX - x) < 1e-6) {
        return sampleCurveY(t);
      }

      if (x > currentX) {
        lower = t;
      } else {
        upper = t;
      }

      t = (upper - lower) * 0.5 + lower;
      if (Math.abs(upper - lower) < 1e-6) {
        break;
      }
    }

    return sampleCurveY(t);
  };
}

const projectSnapEasing = cubicBezier(...projectCardDesktopTransition.ease);

export function DesktopStickyProjects({ projects }: DesktopStickyProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const snapLockTimeoutRef = useRef<number | null>(null);
  const snapLockedRef = useRef(false);
  const snapTargetIndexRef = useRef<number | null>(null);
  const n = projects.length;
  const reduceMotion = useReducedMotion();
  const { scrollToY } = useSmoothScroll();
  const snapEnabled = isDesktop && !reduceMotion;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const syncDesktopMode = () => {
      setIsDesktop(mediaQuery.matches);
    };

    syncDesktopMode();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncDesktopMode);

      return () => {
        mediaQuery.removeEventListener("change", syncDesktopMode);
      };
    }

    mediaQuery.addListener(syncDesktopMode);

    return () => {
      mediaQuery.removeListener(syncDesktopMode);
    };
  }, []);

  const syncActiveIndexFromViewport = useCallback(() => {
    const container = containerRef.current;
    if (!container || n <= 0) return;

    if (!snapEnabled) {
      setActiveIndex(getProgressIndex(scrollYProgress.get(), n));
      return;
    }

    const metrics = getSectionMetrics(container, n);
    setActiveIndex(getNearestProjectIndex(window.scrollY, metrics, n));
  }, [n, scrollYProgress, snapEnabled]);

  const clearSnapState = useCallback(
    (options?: { syncIndex?: boolean }) => {
      if (snapLockTimeoutRef.current !== null) {
        window.clearTimeout(snapLockTimeoutRef.current);
        snapLockTimeoutRef.current = null;
      }

      snapLockedRef.current = false;
      snapTargetIndexRef.current = null;

      if (options?.syncIndex) {
        syncActiveIndexFromViewport();
      }
    },
    [syncActiveIndexFromViewport],
  );

  useEffect(() => {
    if (snapEnabled) return;
    if (n <= 0) return;

    const sync = () => {
      setActiveIndex(getProgressIndex(scrollYProgress.get(), n));
    };

    sync();
    return scrollYProgress.on("change", sync);
  }, [scrollYProgress, snapEnabled, n]);

  useEffect(() => {
    if (!snapEnabled) {
      if (snapLockTimeoutRef.current !== null) {
        window.clearTimeout(snapLockTimeoutRef.current);
        snapLockTimeoutRef.current = null;
      }

      snapLockedRef.current = false;
      snapTargetIndexRef.current = null;
    }
  }, [snapEnabled]);

  useEffect(() => {
    if (n <= 0) return;

    const syncFromViewport = () => {
      if (snapTargetIndexRef.current !== null) {
        setActiveIndex(snapTargetIndexRef.current);
        return;
      }

      syncActiveIndexFromViewport();
    };

    syncFromViewport();
    window.addEventListener("resize", syncFromViewport);

    if (snapEnabled) {
      window.addEventListener("scroll", syncFromViewport, { passive: true });
    }

    return () => {
      window.removeEventListener("resize", syncFromViewport);

      if (snapEnabled) {
        window.removeEventListener("scroll", syncFromViewport);
      }
    };
  }, [n, snapEnabled, syncActiveIndexFromViewport]);

  useEffect(() => {
    if (!snapEnabled || n <= 1) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < WHEEL_DELTA_THRESHOLD) {
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const metrics = getSectionMetrics(container, n);
      const scrollY = window.scrollY;
      const isWithinStickyRange =
        scrollY >= metrics.sectionStart - 1 && scrollY <= metrics.stickyEnd + 1;

      if (!isWithinStickyRange) {
        return;
      }

      if (snapLockedRef.current) {
        event.preventDefault();
        return;
      }

      const currentIndex =
        snapTargetIndexRef.current ?? getNearestProjectIndex(scrollY, metrics, n);
      const direction = event.deltaY > 0 ? 1 : -1;
      const isLeavingUpFromFirst = direction < 0 && currentIndex === 0;
      const isLeavingDownFromLast = direction > 0 && currentIndex === n - 1;

      if (isLeavingUpFromFirst || isLeavingDownFromLast) {
        clearSnapState({ syncIndex: true });
        return;
      }

      const nextIndex = clampIndex(currentIndex + direction, n);
      if (nextIndex === currentIndex) {
        return;
      }

      event.preventDefault();

      if (snapLockTimeoutRef.current !== null) {
        window.clearTimeout(snapLockTimeoutRef.current);
      }

      snapLockedRef.current = true;
      snapTargetIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      scrollToY(getTargetScrollY(metrics, nextIndex), {
        duration: projectCardDesktopTransition.duration,
        easing: projectSnapEasing,
        lock: true,
        onComplete: () => {
          clearSnapState({ syncIndex: true });
        },
      });

      snapLockTimeoutRef.current = window.setTimeout(() => {
        clearSnapState({ syncIndex: true });
      }, SNAP_LOCK_FALLBACK_MS);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);

      if (snapLockTimeoutRef.current !== null) {
        window.clearTimeout(snapLockTimeoutRef.current);
        snapLockTimeoutRef.current = null;
      }

      snapLockedRef.current = false;
      snapTargetIndexRef.current = null;
    };
  }, [clearSnapState, n, scrollToY, snapEnabled]);

  if (n === 0) {
    return null;
  }

  const activeProject = projects[activeIndex] ?? projects[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${n * 100}dvh` }}
    >
      <div
        className="sticky flex w-full items-center justify-center"
        style={{
          top: NAV_OFFSET_PX,
          height: `calc(100dvh - ${NAV_OFFSET_PX}px)`,
        }}
      >
        <ProjectCardDesktop
          project={activeProject}
          activeIndex={activeIndex}
          projectCount={n}
          className="w-full"
        />
      </div>
    </div>
  );
}
