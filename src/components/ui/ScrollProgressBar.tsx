"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

const FADE_SHOULDER = 0.05;

/** Subpixel noise from toolbar animation; values below this snap to 0 to avoid jitter. */
const BOTTOM_OFFSET_JITTER_PX = 1;

/**
 * iOS Safari pins `position: fixed` to the layout viewport bottom, while the visible
 * viewport bottom moves when browser chrome shows/hides. `env(safe-area-inset-bottom)`
 * covers the hardware safe area only, not the transient toolbar inset — so we offset
 * `bottom` using `visualViewport` when the platform is affected.
 */
function isLikelyIosAffectedWebKit(): boolean {
  if (typeof navigator === "undefined") return false;
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return true;
  // iPadOS “desktop” Safari often reports MacIntel + touch.
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
  return false;
}

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
  const [bottomOffsetPx, setBottomOffsetPx] = useState(0);

  const trackHeight = useMemo(() => "clamp(4px, 0.3vw, 12px)", []);

  useEffect(() => {
    let rafId: number | null = null;
    let observer: MutationObserver | null = null;

    const measure = () => {
      rafId = null;
      const el = document.getElementById(targetId);
      if (!el) {
        setIsExclusiveFullscreen(false);
        return;
      }

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

    const initialEl = document.getElementById(targetId);
    if (!initialEl) {
      // Defer to avoid sync setState inside effect body (eslint rule).
      queueMicrotask(() => setIsExclusiveFullscreen(false));
    }

    onChange();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);

    // If the target mounts later (or remounts), re-measure without relying on scroll/resize.
    observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      if (rafId != null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      observer?.disconnect();
    };
  }, [targetId, tolerancePx]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isLikelyIosAffectedWebKit()) return;

    const vv = window.visualViewport;
    if (!vv) return;

    let rafId: number | null = null;

    const measureBottomOffset = () => {
      rafId = null;
      const innerH = window.innerHeight;
      const layoutViewportBottom = innerH;
      const visualViewportBottom = vv.offsetTop + vv.height;
      let px = layoutViewportBottom - visualViewportBottom;
      px = Math.max(0, Math.min(px, innerH));
      if (px < BOTTOM_OFFSET_JITTER_PX) px = 0;
      else px = Math.round(px);

      setBottomOffsetPx((prev) => (prev === px ? prev : px));
    };

    const schedule = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(measureBottomOffset);
    };

    measureBottomOffset();
    vv.addEventListener("resize", schedule);
    vv.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);

    return () => {
      if (rafId != null) window.cancelAnimationFrame(rafId);
      vv.removeEventListener("resize", schedule);
      vv.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed right-0 left-0 z-30 pb-[env(safe-area-inset-bottom)]"
      style={{
        bottom: bottomOffsetPx,
        opacity: isExclusiveFullscreen ? opacity : 0,
      }}
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
