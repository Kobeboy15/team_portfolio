"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

import { heroData } from "../../data/hero";

const loaderEase = [0.22, 1, 0.36, 1] as const;

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
  const progressValue = useMotionValue(progress);
  const progressSpring = useSpring(progressValue, {
    stiffness: 160,
    damping: 28,
    mass: 0.4,
  });

  useEffect(() => {
    progressValue.set(progress);
  }, [progress, progressValue]);

  useEffect(() => {
    if (!isBlocking) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isBlocking]);

  if (!isBlocking) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[70] flex items-end bg-background-2"
      initial={{ opacity: 1, y: 0 }}
      animate={
        isReady
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
        if (!isReady || hasDismissed.current) return;
        hasDismissed.current = true;
        onDismiss();
      }}
    >
      <div className="relative flex h-full w-full items-end overflow-hidden">
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 border-t border-black/20 bg-foreground/10">
          <motion.div
            className="h-[clamp(4px,0.3vw,12px)] w-full origin-left bg-foreground/80"
            style={{
              scaleX: progressSpring,
              boxShadow:
                "0 0 10px color-mix(in oklab, var(--color-foreground) 45%, transparent), 0 0 20px color-mix(in oklab, var(--color-foreground) 20%, transparent)",
            }}
          />
        </div>

        <motion.div
          className="px-4 pb-5 sm:px-5 sm:pb-6 lg:px-7 lg:pb-7"
          animate={{
            opacity: isReady ? 0.78 : 1,
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
