"use client";

import { useEffect, useState, type RefObject } from "react";

export type DesktopSeparatorTrackMetrics = {
  offsetLeft: number;
  width: number;
};

const DEFAULT_METRICS: DesktopSeparatorTrackMetrics = {
  offsetLeft: 0,
  width: 0,
};

export function useDesktopSeparatorTrackMetrics(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [metrics, setMetrics] = useState<DesktopSeparatorTrackMetrics>(DEFAULT_METRICS);

  useEffect(() => {
    if (!enabled) return;

    const measure = () => {
      if (!ref.current) return;

      setMetrics({
        offsetLeft: ref.current.offsetLeft,
        width: ref.current.offsetWidth,
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    const scrollContainer = ref.current?.closest<HTMLElement>("[data-scroll-container]");
    if (scrollContainer) resizeObserver.observe(scrollContainer);
    if (ref.current) resizeObserver.observe(ref.current);

    window.addEventListener("resize", measure);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [enabled, ref]);

  return metrics;
}
