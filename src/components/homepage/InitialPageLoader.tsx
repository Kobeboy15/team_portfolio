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
  const hasDismissed = useRef(false);
  const hasStartedExit = useRef(false);
  const previousIsReady = useRef(isReady);
  const latestVisualTarget = useRef(progress);
  const progressValue = useMotionValue(progress);
  const [phase, setPhase] = useState<LoaderPhase>("loading");
  const progressSpring = useSpring(progressValue, {
    stiffness: 90,
    damping: 22,
    mass: 0.95,
    restDelta: 0.0008,
    restSpeed: 0.0008,
  });

  useEffect(() => {
    if (reduceMotion) {
      progressValue.set(isReady ? 1 : progress);
      latestVisualTarget.current = isReady ? 1 : progress;
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
    if (phase !== "finishing-bar") return;
    if (hasStartedExit.current) return;
    if (value < EXIT_PROGRESS_THRESHOLD) return;

    hasStartedExit.current = true;
    setPhase("exiting");
  });

  useEffect(() => {
    if (!isBlocking) return;

    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [isBlocking]);

  if (!isBlocking) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[70] flex items-end bg-background-2"
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
