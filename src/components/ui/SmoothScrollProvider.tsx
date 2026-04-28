"use client";

import Lenis, { type EasingFunction } from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ANCHOR_OFFSET_ATTRIBUTE, FIXED_HEADER_OFFSET_PX } from "../../lib/scrollAnchors";

const LENIS_LERP = 0.085;
const LENIS_DURATION_S = 0.9;
const HASH_SCROLL_DURATION_S = 0.9;
const NATIVE_SCROLL_COMPLETION_THRESHOLD_PX = 2;
const NATIVE_SCROLL_COMPLETION_STABLE_FRAMES = 2;

type NativeScrollZoneRange = {
  startY: number;
  endY: number;
};

type NativeScrollZoneDefinition = {
  isActive: () => boolean;
  getRange?: () => NativeScrollZoneRange | null;
};

type ProgrammaticNavigation = {
  strategy: "lenis" | "native";
  targetY: number;
  rafId: number | null;
};

type ScrollToHashOptions = {
  immediate?: boolean;
  updateHash?: "push" | "replace" | false;
};

type ScrollToYOptions = {
  immediate?: boolean;
  duration?: number;
  easing?: EasingFunction;
  lock?: boolean;
  onComplete?: () => void;
};

type SmoothScrollContextValue = {
  scrollToHash: (hash: string, options?: ScrollToHashOptions) => boolean;
  scrollToY: (targetY: number, options?: ScrollToYOptions) => boolean;
  registerNativeScrollZone: (id: string, definition: NativeScrollZoneDefinition) => () => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function normalizeHash(hash: string) {
  return hash.startsWith("#") ? hash : `#${hash}`;
}

function getElementForHash(hash: string) {
  const normalizedHash = normalizeHash(hash);
  const rawId = normalizedHash.slice(1);

  if (!rawId) return null;
  if (rawId === "top") return document.documentElement;

  let decodedId: string;
  try {
    decodedId = decodeURIComponent(rawId);
  } catch {
    return null;
  }

  return (
    document.getElementById(decodedId) ??
    document.querySelector<HTMLElement>(`[id="${CSS.escape(decodedId)}"]`)
  );
}

function getAnchorOffsetPx(target: HTMLElement) {
  const rawOffset = target.getAttribute(ANCHOR_OFFSET_ATTRIBUTE);
  if (rawOffset !== null) {
    const parsed = Number(rawOffset);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  const computed = window.getComputedStyle(target).scrollMarginTop;
  const parsedMargin = Number.parseFloat(computed);
  if (Number.isFinite(parsedMargin)) {
    return parsedMargin;
  }

  return FIXED_HEADER_OFFSET_PX;
}

function getMaxScrollY() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function clampScrollY(value: number) {
  return Math.min(Math.max(value, 0), getMaxScrollY());
}

function getTargetScrollTop(target: HTMLElement) {
  if (target === document.documentElement) {
    return 0;
  }

  const rawTargetY =
    window.scrollY + target.getBoundingClientRect().top - getAnchorOffsetPx(target);

  return clampScrollY(rawTargetY);
}

function getNormalizedRange(range: NativeScrollZoneRange) {
  return {
    startY: Math.min(range.startY, range.endY),
    endY: Math.max(range.startY, range.endY),
  };
}

function doesPathIntersectRange(
  currentY: number,
  targetY: number,
  range: NativeScrollZoneRange,
) {
  const pathStart = Math.min(currentY, targetY);
  const pathEnd = Math.max(currentY, targetY);
  const normalizedRange = getNormalizedRange(range);

  return normalizedRange.endY >= pathStart && normalizedRange.startY <= pathEnd;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const viewportRafRef = useRef<number | null>(null);
  const nativeZonesRef = useRef(new Map<string, NativeScrollZoneDefinition>());
  const activeNativeZoneIdRef = useRef<string | null>(null);
  const programmaticNavigationRef = useRef<ProgrammaticNavigation | null>(null);
  const initialHashHandledRef = useRef(false);
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window === "undefined" ? false : prefersReducedMotion(),
  );

  const syncLenisToViewport = useCallback(() => {
    lenisRef.current?.scrollTo(window.scrollY, {
      immediate: true,
      force: true,
      lock: false,
    });
  }, []);

  const finishProgrammaticNavigation = useCallback(() => {
    const currentNavigation = programmaticNavigationRef.current;
    if (currentNavigation && currentNavigation.rafId !== null) {
      window.cancelAnimationFrame(currentNavigation.rafId);
    }

    programmaticNavigationRef.current = null;
    syncLenisToViewport();
  }, [syncLenisToViewport]);

  const evaluateNativeScrollZones = useCallback(() => {
    if (programmaticNavigationRef.current) {
      return;
    }

    let nextActiveZoneId: string | null = null;

    for (const [id, definition] of nativeZonesRef.current) {
      try {
        if (definition.isActive()) {
          nextActiveZoneId = id;
          break;
        }
      } catch {
        continue;
      }
    }

    const previousActiveZoneId = activeNativeZoneIdRef.current;
    if (previousActiveZoneId === nextActiveZoneId) {
      return;
    }

    if (nextActiveZoneId) {
      syncLenisToViewport();
      activeNativeZoneIdRef.current = nextActiveZoneId;
      return;
    }

    activeNativeZoneIdRef.current = null;
    syncLenisToViewport();
    lenisRef.current?.resize();
  }, [syncLenisToViewport]);

  const monitorNativeProgrammaticNavigation = useCallback(
    (targetY: number) => {
      let stableFrames = 0;

      const tick = () => {
        const currentNavigation = programmaticNavigationRef.current;
        if (
          !currentNavigation ||
          currentNavigation.strategy !== "native" ||
          currentNavigation.targetY !== targetY
        ) {
          return;
        }

        const delta = Math.abs(window.scrollY - targetY);
        if (delta <= NATIVE_SCROLL_COMPLETION_THRESHOLD_PX) {
          stableFrames += 1;

          if (stableFrames >= NATIVE_SCROLL_COMPLETION_STABLE_FRAMES) {
            finishProgrammaticNavigation();
            evaluateNativeScrollZones();
            return;
          }
        } else {
          stableFrames = 0;
        }

        currentNavigation.rafId = window.requestAnimationFrame(tick);
      };

      const currentNavigation = programmaticNavigationRef.current;
      if (!currentNavigation) return;

      currentNavigation.rafId = window.requestAnimationFrame(tick);
    },
    [evaluateNativeScrollZones, finishProgrammaticNavigation],
  );

  const scrollToY = useCallback(
    (targetY: number, options: ScrollToYOptions = {}) => {
      const shouldReduceMotion = prefersReducedMotion();
      const immediate = options.immediate ?? shouldReduceMotion;
      const normalizedTargetY = clampScrollY(targetY);

      finishProgrammaticNavigation();

      if (lenisRef.current && !shouldReduceMotion) {
        programmaticNavigationRef.current = {
          strategy: "lenis",
          targetY: normalizedTargetY,
          rafId: null,
        };

        lenisRef.current.scrollTo(normalizedTargetY, {
          immediate,
          duration: immediate ? undefined : options.duration,
          easing: options.easing,
          lock: options.lock ?? false,
          force: true,
          onComplete: () => {
            finishProgrammaticNavigation();
            evaluateNativeScrollZones();
            options.onComplete?.();
          },
        });
        return true;
      }

      programmaticNavigationRef.current = {
        strategy: "native",
        targetY: normalizedTargetY,
        rafId: null,
      };

      syncLenisToViewport();

      window.scrollTo({
        top: normalizedTargetY,
        behavior: shouldReduceMotion || immediate ? "auto" : "smooth",
      });

      if (shouldReduceMotion || immediate) {
        finishProgrammaticNavigation();
        evaluateNativeScrollZones();
        options.onComplete?.();
        return true;
      }

      monitorNativeProgrammaticNavigation(normalizedTargetY);
      return true;
    },
    [
      evaluateNativeScrollZones,
      finishProgrammaticNavigation,
      monitorNativeProgrammaticNavigation,
      syncLenisToViewport,
    ],
  );

  const scrollToHash = useCallback(
    (hash: string, options: ScrollToHashOptions = {}) => {
      const normalizedHash = normalizeHash(hash);
      const target = getElementForHash(normalizedHash);

      if (!target) {
        return false;
      }

      const shouldReduceMotion = prefersReducedMotion();
      const immediate = options.immediate ?? shouldReduceMotion;
      const nextUrl = `${window.location.pathname}${window.location.search}${normalizedHash}`;

      if (options.updateHash === "push" && window.location.hash !== normalizedHash) {
        window.history.pushState(null, "", nextUrl);
      } else if (options.updateHash === "replace") {
        window.history.replaceState(null, "", nextUrl);
      }

      finishProgrammaticNavigation();

      const currentY = window.scrollY;
      const targetY = clampScrollY(getTargetScrollTop(target));

      const crossesNativeZone =
        activeNativeZoneIdRef.current !== null ||
        Array.from(nativeZonesRef.current.values()).some((definition) => {
          try {
            const range = definition.getRange?.();
            return range ? doesPathIntersectRange(currentY, targetY, range) : false;
          } catch {
            return false;
          }
        });

      if (lenisRef.current && !shouldReduceMotion && !crossesNativeZone) {
        return scrollToY(targetY, {
          duration: immediate ? undefined : HASH_SCROLL_DURATION_S,
          immediate,
          lock: false,
          onComplete: () => {
            evaluateNativeScrollZones();
          },
        });
      }

      programmaticNavigationRef.current = {
        strategy: "native",
        targetY,
        rafId: null,
      };

      syncLenisToViewport();

      window.scrollTo({
        top: targetY,
        behavior: shouldReduceMotion || immediate ? "auto" : "smooth",
      });

      if (shouldReduceMotion || immediate) {
        finishProgrammaticNavigation();
        evaluateNativeScrollZones();
        return true;
      }

      monitorNativeProgrammaticNavigation(targetY);
      return true;
    },
    [
      evaluateNativeScrollZones,
      finishProgrammaticNavigation,
      monitorNativeProgrammaticNavigation,
      scrollToY,
      syncLenisToViewport,
    ],
  );

  const registerNativeScrollZone = useCallback(
    (id: string, definition: NativeScrollZoneDefinition) => {
      nativeZonesRef.current.set(id, definition);
      evaluateNativeScrollZones();

      return () => {
        nativeZonesRef.current.delete(id);
        evaluateNativeScrollZones();
      };
    },
    [evaluateNativeScrollZones],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      setReduceMotion(mediaQuery.matches);
    };

    syncReducedMotion();
    mediaQuery.addEventListener("change", syncReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", syncReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || reduceMotion) {
      finishProgrammaticNavigation();
      lenisRef.current?.destroy();
      lenisRef.current = null;

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      anchors: false,
      lerp: LENIS_LERP,
      duration: LENIS_DURATION_S,
      smoothWheel: true,
      syncTouch: false,
      stopInertiaOnNavigate: true,
      virtualScroll: () =>
        activeNativeZoneIdRef.current === null &&
        programmaticNavigationRef.current?.strategy !== "native",
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      const isNativeZoneActive = activeNativeZoneIdRef.current !== null;
      const isNativeProgrammaticNavigationActive =
        programmaticNavigationRef.current?.strategy === "native";

      if (!isNativeZoneActive && !isNativeProgrammaticNavigationActive) {
        lenis.raf(time);
      }

      rafRef.current = window.requestAnimationFrame(raf);
    };

    rafRef.current = window.requestAnimationFrame(raf);
    evaluateNativeScrollZones();

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      finishProgrammaticNavigation();
      lenis.destroy();
      lenisRef.current = null;
      activeNativeZoneIdRef.current = null;
    };
  }, [evaluateNativeScrollZones, finishProgrammaticNavigation, reduceMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onViewportChange = () => {
      if (viewportRafRef.current !== null) {
        return;
      }

      viewportRafRef.current = window.requestAnimationFrame(() => {
        viewportRafRef.current = null;
        evaluateNativeScrollZones();
      });
    };

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      if (viewportRafRef.current !== null) {
        window.cancelAnimationFrame(viewportRafRef.current);
        viewportRafRef.current = null;
      }

      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [evaluateNativeScrollZones]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const onDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      if (!getElementForHash(href)) {
        return;
      }

      event.preventDefault();
      scrollToHash(href, { updateHash: "push" });
    };

    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, [scrollToHash]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initialHashHandledRef.current) return;
    if (!window.location.hash) return;

    initialHashHandledRef.current = true;

    const rafId = window.requestAnimationFrame(() => {
      scrollToHash(window.location.hash, {
        immediate: true,
        updateHash: "replace",
      });
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [scrollToHash]);

  const value = useMemo<SmoothScrollContextValue>(
    () => ({
      scrollToHash,
      scrollToY,
      registerNativeScrollZone,
    }),
    [registerNativeScrollZone, scrollToHash, scrollToY],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);

  if (!context) {
    throw new Error("useSmoothScroll must be used within SmoothScrollProvider.");
  }

  return context;
}

export function useNativeScrollZone(
  id: string,
  definition: NativeScrollZoneDefinition,
) {
  const { registerNativeScrollZone } = useSmoothScroll();

  const definitionRef = useRef(definition);
  useEffect(() => {
    definitionRef.current = definition;
  }, [definition]);

  const stableDefinition = useMemo<NativeScrollZoneDefinition>(
    () => ({
      isActive: () => definitionRef.current.isActive(),
      getRange: () => definitionRef.current.getRange?.() ?? null,
    }),
    [],
  );

  useEffect(
    () => registerNativeScrollZone(id, stableDefinition),
    [id, registerNativeScrollZone],
  );
}
