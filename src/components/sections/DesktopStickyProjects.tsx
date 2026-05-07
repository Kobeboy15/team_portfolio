"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useReducedMotion, useScroll } from "framer-motion";

import type { Project } from "../../types/projects";
import { useSmoothScroll } from "../ui/SmoothScrollProvider";

import { ProjectCardDesktop } from "./ProjectCardDesktop";
import {
  PROJECT_CARD_DESKTOP_TRANSITION_SETTLE_MS,
  projectCardDesktopTransition,
} from "./projectCardDesktopMotion";

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

type RenderState = {
  renderedIndex: number;
  renderCycle: number;
  isCardTransitioning: boolean;
};

type RenderAction =
  | { type: "syncImmediate"; nextIndex: number }
  | { type: "beginTransition"; nextIndex: number }
  | { type: "finishTransition" };

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

function renderStateReducer(state: RenderState, action: RenderAction): RenderState {
  switch (action.type) {
    case "syncImmediate":
      if (
        state.renderedIndex === action.nextIndex &&
        state.isCardTransitioning === false
      ) {
        return state;
      }

      return {
        renderedIndex: action.nextIndex,
        renderCycle: state.renderCycle,
        isCardTransitioning: false,
      };
    case "beginTransition":
      if (state.renderedIndex === action.nextIndex && state.isCardTransitioning) {
        return state;
      }

      return {
        renderedIndex: action.nextIndex,
        renderCycle: state.renderCycle + 1,
        isCardTransitioning: true,
      };
    case "finishTransition":
      if (!state.isCardTransitioning) {
        return state;
      }

      return {
        ...state,
        isCardTransitioning: false,
      };
    default:
      return state;
  }
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
  const [targetIndex, setTargetIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [renderState, dispatchRenderState] = useReducer(renderStateReducer, {
    renderedIndex: 0,
    renderCycle: 0,
    isCardTransitioning: false,
  });
  const snapLockTimeoutRef = useRef<number | null>(null);
  const cardTransitionTimeoutRef = useRef<number | null>(null);
  const snapLockedRef = useRef(false);
  const snapTargetIndexRef = useRef<number | null>(null);
  const n = projects.length;
  const reduceMotion = useReducedMotion();
  const { scrollToY } = useSmoothScroll();
  const snapEnabled = isDesktop && !reduceMotion;
  const { renderedIndex, renderCycle, isCardTransitioning } = renderState;

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
      setTargetIndex(getProgressIndex(scrollYProgress.get(), n));
      return;
    }

    const metrics = getSectionMetrics(container, n);
    setTargetIndex(getNearestProjectIndex(window.scrollY, metrics, n));
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

  const syncRenderedIndexImmediately = useCallback((nextIndex: number) => {
    dispatchRenderState({ type: "syncImmediate", nextIndex });
  }, []);

  const beginCardTransition = useCallback((nextIndex: number) => {
    dispatchRenderState({ type: "beginTransition", nextIndex });
  }, []);

  useEffect(() => {
    if (snapEnabled) return;
    if (n <= 0) return;

    const sync = () => {
      setTargetIndex(getProgressIndex(scrollYProgress.get(), n));
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
    if (!snapEnabled) {
      if (cardTransitionTimeoutRef.current !== null) {
        window.clearTimeout(cardTransitionTimeoutRef.current);
        cardTransitionTimeoutRef.current = null;
      }

      const rafId = window.requestAnimationFrame(() => {
        syncRenderedIndexImmediately(targetIndex);
      });

      return () => {
        window.cancelAnimationFrame(rafId);
      };
    }

    if (isCardTransitioning || renderedIndex === targetIndex) {
      return;
    }

    beginCardTransition(targetIndex);
  }, [
    beginCardTransition,
    isCardTransitioning,
    renderedIndex,
    snapEnabled,
    syncRenderedIndexImmediately,
    targetIndex,
  ]);

  useEffect(() => {
    if (!snapEnabled || !isCardTransitioning) {
      if (cardTransitionTimeoutRef.current !== null) {
        window.clearTimeout(cardTransitionTimeoutRef.current);
        cardTransitionTimeoutRef.current = null;
      }

      return;
    }

    cardTransitionTimeoutRef.current = window.setTimeout(() => {
      dispatchRenderState({ type: "finishTransition" });
    }, PROJECT_CARD_DESKTOP_TRANSITION_SETTLE_MS);

    return () => {
      if (cardTransitionTimeoutRef.current !== null) {
        window.clearTimeout(cardTransitionTimeoutRef.current);
        cardTransitionTimeoutRef.current = null;
      }
    };
  }, [isCardTransitioning, snapEnabled]);

  useEffect(() => {
    if (n <= 0) return;

    const syncFromViewport = () => {
      if (snapTargetIndexRef.current !== null) {
        setTargetIndex(snapTargetIndexRef.current);
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
      setTargetIndex(nextIndex);

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

  const renderedProject = projects[renderedIndex] ?? projects[0];
  const cardTransitionKey = `${renderCycle}-${renderedProject.id}`;

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
          project={renderedProject}
          activeIndex={renderedIndex}
          projectCount={n}
          transitionKey={cardTransitionKey}
          className="w-full"
        />
      </div>
    </div>
  );
}
