"use client";

import Lenis from "lenis";
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

type NativeScrollZoneMatcher = () => boolean;

type ScrollToHashOptions = {
  immediate?: boolean;
  updateHash?: "push" | "replace" | false;
};

type SmoothScrollContextValue = {
  scrollToHash: (hash: string, options?: ScrollToHashOptions) => boolean;
  registerNativeScrollZone: (id: string, matcher: NativeScrollZoneMatcher) => () => void;
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

  const decodedId = decodeURIComponent(rawId);

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

function getTargetScrollTop(target: HTMLElement) {
  if (target === document.documentElement) {
    return 0;
  }

  return Math.max(
    0,
    window.scrollY + target.getBoundingClientRect().top - getAnchorOffsetPx(target),
  );
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const nativeZonesRef = useRef(new Map<string, NativeScrollZoneMatcher>());
  const activeNativeZoneIdRef = useRef<string | null>(null);
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

  const evaluateNativeScrollZones = useCallback(() => {
    let nextActiveZoneId: string | null = null;

    for (const [id, matcher] of nativeZonesRef.current) {
      try {
        if (matcher()) {
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

      const targetTop = getTargetScrollTop(target);
      const hasNativeZoneOwner = activeNativeZoneIdRef.current !== null;

      if (lenisRef.current && !shouldReduceMotion && !hasNativeZoneOwner) {
        lenisRef.current.scrollTo(targetTop, {
          duration: immediate ? undefined : HASH_SCROLL_DURATION_S,
          immediate,
          force: true,
          lock: false,
        });
        return true;
      }

      window.scrollTo({
        top: targetTop,
        behavior: shouldReduceMotion || immediate ? "auto" : "smooth",
      });
      return true;
    },
    [],
  );

  const registerNativeScrollZone = useCallback(
    (id: string, matcher: NativeScrollZoneMatcher) => {
      nativeZonesRef.current.set(id, matcher);
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
      virtualScroll: () => activeNativeZoneIdRef.current === null,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      if (activeNativeZoneIdRef.current === null) {
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

      lenis.destroy();
      lenisRef.current = null;
      activeNativeZoneIdRef.current = null;
    };
  }, [evaluateNativeScrollZones, reduceMotion]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onViewportChange = () => {
      evaluateNativeScrollZones();
    };

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
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
      registerNativeScrollZone,
    }),
    [registerNativeScrollZone, scrollToHash],
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

export function useNativeScrollZone(id: string, matcher: NativeScrollZoneMatcher) {
  const { registerNativeScrollZone } = useSmoothScroll();

  useEffect(() => registerNativeScrollZone(id, matcher), [id, matcher, registerNativeScrollZone]);
}
