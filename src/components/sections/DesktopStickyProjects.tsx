"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion, useScroll } from "framer-motion";

import type { Project } from "../../types/projects";
import { useNativeScrollZone } from "../ui/SmoothScrollProvider";

import { ProjectCardDesktop } from "./ProjectCardDesktop";
import { projectCardDesktopTransition } from "./projectCardDesktopMotion";

const NAV_OFFSET_PX = 72;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
const WHEEL_DELTA_THRESHOLD = 18;
const SNAP_LOCK_MS = Math.round(projectCardDesktopTransition.duration * 1000) + 120;

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

export function DesktopStickyProjects({ projects }: DesktopStickyProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const snapLockTimeoutRef = useRef<number | null>(null);
  const snapLockedRef = useRef(false);
  const snapTargetIndexRef = useRef<number | null>(null);
  const n = projects.length;
  const reduceMotion = useReducedMotion();
  const snapEnabled = isDesktop && !reduceMotion;
  const snapEnabledRef = useRef(snapEnabled);
  const projectCountRef = useRef(n);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    snapEnabledRef.current = snapEnabled;
  }, [snapEnabled]);

  useEffect(() => {
    projectCountRef.current = n;
  }, [n]);

  const isNativeScrollZoneActive = useCallback(() => {
    const container = containerRef.current;
    const projectCount = projectCountRef.current;

    if (!container || !snapEnabledRef.current || projectCount <= 1) {
      return false;
    }

    const metrics = getSectionMetrics(container, projectCount);
    const scrollY = window.scrollY;

    return scrollY >= metrics.sectionStart - 1 && scrollY <= metrics.stickyEnd + 1;
  }, []);

  useNativeScrollZone("desktop-sticky-projects", isNativeScrollZoneActive);

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
      const container = containerRef.current;
      if (!container) return;

      if (snapTargetIndexRef.current !== null) {
        setActiveIndex(snapTargetIndexRef.current);
        return;
      }

      if (!snapEnabled) {
        setActiveIndex(getProgressIndex(scrollYProgress.get(), n));
        return;
      }

      const metrics = getSectionMetrics(container, n);
      setActiveIndex(getNearestProjectIndex(window.scrollY, metrics, n));
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
  }, [scrollYProgress, snapEnabled, n]);

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
        snapTargetIndexRef.current = null;
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

      window.scrollTo({
        top: getTargetScrollY(metrics, nextIndex),
        behavior: "smooth",
      });

      snapLockTimeoutRef.current = window.setTimeout(() => {
        snapLockedRef.current = false;
        snapTargetIndexRef.current = null;
        snapLockTimeoutRef.current = null;

        const nextContainer = containerRef.current;
        if (!nextContainer) return;

        const nextMetrics = getSectionMetrics(nextContainer, n);
        setActiveIndex(getNearestProjectIndex(window.scrollY, nextMetrics, n));
      }, SNAP_LOCK_MS);
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
  }, [snapEnabled, n]);

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
        <ProjectCardDesktop project={activeProject} className="w-full" />
      </div>
    </div>
  );
}
