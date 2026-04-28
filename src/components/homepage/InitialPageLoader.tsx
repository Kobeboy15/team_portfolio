"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { heroData } from "../../data/hero";
import { lockScroll, unlockScroll } from "../../lib/scrollLock";

const loaderEase = [0.22, 1, 0.36, 1] as const;
const EXIT_PROGRESS_THRESHOLD = 0.995;

type LoaderPhase = "loading" | "finishing-bar" | "exiting";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function InitialPageLoader({
  isBlocking,
  isReady,
  onDismiss,
  progress,
}: {
  isBlocking: boolean;
  isReady: boolean;
  onDismiss: () => void;
  progress: number;
}) {
  const reduceMotion = useReducedMotion();
  const initialPercent = Math.round(clamp01(isReady ? 1 : progress) * 100);
  const hasDismissed = useRef(false);
  const hasStartedExit = useRef(false);
  const previousIsReady = useRef(isReady);
  const latestVisualTarget = useRef(progress);
  const progressValue = useMotionValue(progress);
  const [phase, setPhase] = useState<LoaderPhase>("loading");
  const [announcedPercent, setAnnouncedPercent] = useState(() => initialPercent);
  const lastAnnouncedPercentRef = useRef(initialPercent);
  const progressSpring = useSpring(progressValue, {
    stiffness: 90,
    damping: 22,
    mass: 0.95,
    restDelta: 0.0008,
    restSpeed: 0.0008,
  });

  useEffect(() => {
    if (reduceMotion) {
      const nextTarget = isReady ? 1 : progress;
      progressValue.set(nextTarget);
      latestVisualTarget.current = nextTarget;
      return;
    }

    const nextTarget = isReady ? 1 : Math.max(progress, latestVisualTarget.current);
    latestVisualTarget.current = nextTarget;
    progressValue.set(nextTarget);
  }, [isReady, progress, progressValue, reduceMotion]);

  useEffect(() => {
    const becameReady = !previousIsReady.current && isReady;
    const becameNotReady = previousIsReady.current && !isReady;
    previousIsReady.current = isReady;

    if (becameNotReady) {
      hasStartedExit.current = false;
      queueMicrotask(() => {
        setPhase("loading");
      });
      return;
    }

    if (!becameReady) {
      return;
    }

    queueMicrotask(() => {
      setPhase(reduceMotion ? "exiting" : "finishing-bar");
    });
  }, [isReady, reduceMotion]);

  useMotionValueEvent(progressSpring, "change", (value) => {
    if (reduceMotion) return;
    if (!isBlocking) return;

    const nextPercent = Math.round(clamp01(value) * 100);
    const monotonicPercent = Math.max(lastAnnouncedPercentRef.current, nextPercent);
    if (monotonicPercent === lastAnnouncedPercentRef.current) return;

    lastAnnouncedPercentRef.current = monotonicPercent;
    setAnnouncedPercent(monotonicPercent);
  });

  useMotionValueEvent(progressSpring, "change", (value) => {
    if (reduceMotion) return;
    if (phase !== "finishing-bar") return;
    if (hasStartedExit.current) return;
    if (value < EXIT_PROGRESS_THRESHOLD) return;

    hasStartedExit.current = true;
    setPhase("exiting");
  });

  useEffect(() => {
    if (reduceMotion) return;
    if (!isBlocking) return;
    if (phase !== "finishing-bar") return;
    if (hasStartedExit.current) return;

    const currentProgress = progressSpring.get();
    if (currentProgress < EXIT_PROGRESS_THRESHOLD) return;

    hasStartedExit.current = true;
    queueMicrotask(() => {
      setPhase("exiting");
    });
  }, [isBlocking, phase, progressSpring, reduceMotion]);

  useEffect(() => {
    if (!isBlocking) return;

    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isBlocking]);

  if (!isBlocking) return null;

  const visiblePercent = reduceMotion ? initialPercent : announcedPercent;

  return (
    <motion.div
      role="status"
      aria-live={phase === "exiting" ? "off" : "polite"}
      aria-atomic="true"
      className="fixed inset-0 z-70 flex items-end bg-background-2"
      initial={{ opacity: 1, y: 0 }}
      animate={
        phase === "exiting"
          ? reduceMotion
            ? { opacity: 0, y: 0 }
            : { opacity: 1, y: "-100%" }
          : { opacity: 1, y: 0 }
      }
      transition={{
        duration: reduceMotion ? 0.18 : 0.8,
        ease: loaderEase,
      }}
      onAnimationComplete={() => {
        if (phase !== "exiting" || hasDismissed.current) return;
        hasDismissed.current = true;
        onDismiss();
      }}
    >
      <span className="sr-only">
        {phase === "exiting" ? "Loading complete." : `Loading ${visiblePercent}%`}
      </span>
      <div className="relative flex h-full w-full items-end overflow-hidden">
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 border-t border-black/20 bg-foreground/10">
          <motion.div
            className="h-[clamp(4px,0.3vw,12px)] w-full origin-left bg-foreground/80"
            style={{
              scaleX: reduceMotion ? (isReady ? 1 : progress) : progressSpring,
              boxShadow:
                "0 0 10px color-mix(in oklab, var(--color-foreground) 45%, transparent), 0 0 20px color-mix(in oklab, var(--color-foreground) 20%, transparent)",
            }}
          />
        </div>

        <motion.div
          className="px-4 pb-5 sm:px-5 sm:pb-6 lg:px-7 lg:pb-7"
          animate={{
            opacity: phase === "exiting" ? 0.78 : 1,
          }}
          transition={{ duration: 0.18 }}
        >
          <h1 className="font-bebas text-display-48 tracking-display text-foreground">
            {heroData.name}
          </h1>
        </motion.div>
      </div>
    </motion.div>
  );
}
