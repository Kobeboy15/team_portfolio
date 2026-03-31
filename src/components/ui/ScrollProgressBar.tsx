"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

const FADE_SHOULDER = 0.05;

export type ScrollProgressBarProps = {
  scrollYProgress: MotionValue<number>;
};

export function ScrollProgressBar({ scrollYProgress }: ScrollProgressBarProps) {
  const opacity = useTransform(
    scrollYProgress,
    [0, FADE_SHOULDER, 1 - FADE_SHOULDER, 1],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 bottom-0 left-0 z-30 pb-[env(safe-area-inset-bottom)]"
      style={{ opacity }}
    >
      <div className="h-0.5 w-full overflow-hidden bg-white/10">
        <motion.div
          className="h-full w-full origin-left bg-white/75"
          style={{
            scaleX: scrollYProgress,
            boxShadow:
              "0 0 10px rgba(255, 255, 255, 0.45), 0 0 20px rgba(255, 255, 255, 0.15)",
          }}
        />
      </div>
    </motion.div>
  );
}
