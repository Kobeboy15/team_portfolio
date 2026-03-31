"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

const FADE_SHOULDER = 0.05;

export type ScrollProgressBarProps = {
  scrollYProgress: MotionValue<number>;
  /**
   * Element id whose rect must fully cover the viewport for the bar to appear.
   * Defaults to the About section id.
   */
  targetId?: string;
  /**
   * Pixel tolerance to avoid flicker from subpixel layout/scrolling.
   * Defaults to 2px.
   */
  tolerancePx?: number;
};

export function ScrollProgressBar({
  scrollYProgress,
  targetId = "about",
  tolerancePx = 2,
}: ScrollProgressBarProps) {
  const opacity = useTransform(
    scrollYProgress,
    [0, FADE_SHOULDER, 1 - FADE_SHOULDER, 1],
    [0, 1, 1, 0],
  );

  const [isExclusiveFullscreen, setIsExclusiveFullscreen] = useState(false);

  const trackHeight = useMemo(() => "clamp(4px, 0.3vw, 12px)", []);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) {
      // Defer to avoid sync setState inside effect body (eslint rule).
      queueMicrotask(() => setIsExclusiveFullscreen(false));
      return;
    }

    let rafId: number | null = null;

    const measure = () => {
      rafId = null;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const coversTop = rect.top <= tolerancePx;
      const coversBottom = rect.bottom >= vh - tolerancePx;
      setIsExclusiveFullscreen(coversTop && coversBottom);
    };

    const onChange = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);

    return () => {
      if (rafId != null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [targetId, tolerancePx]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 bottom-0 left-0 z-30 pb-[env(safe-area-inset-bottom)]"
      style={{ opacity: isExclusiveFullscreen ? opacity : 0 }}
    >
      <div
        className="w-full overflow-hidden bg-foreground/10"
        style={{ height: trackHeight }}
      >
        <motion.div
          className="h-full w-full origin-left bg-foreground/80"
          style={{
            scaleX: scrollYProgress,
            boxShadow:
              "0 0 10px color-mix(in oklab, var(--color-foreground) 45%, transparent), 0 0 20px color-mix(in oklab, var(--color-foreground) 20%, transparent)",
          }}
        />
      </div>
    </motion.div>
  );
}
