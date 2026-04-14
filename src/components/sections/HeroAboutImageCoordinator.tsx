"use client";

import Image from "next/image";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  motion,
  type MotionValue,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { heroData } from "../../data/hero";
import { ABOUT_SECTION_ROOT_ID } from "./heroAboutConstants";
import { HeroAboutImageContextProvider } from "./HeroAboutImageContext";

const LG_MEDIA_QUERY = "(min-width: 1024px)";

const T_SPRING = { stiffness: 160, damping: 32 };

/** Handoff when lerped fixed rect matches about slot (px), not raw scroll progress. */
const RECT_MATCH_EPS_PX = 2.5;
/** Avoid docking at t≈0 when hero/about rects can be numerically odd. */
const MIN_T_TO_ALLOW_DOCK = 0.72;
/** Hysteresis: undock when scroll springs back below this or rects separate. */
const UNDOCK_T = 0.86;
const UNDOCK_ERR_PX = 10;

function mergeFlightProgress(heroP: number, aboutP: number): number {
  return 0.5 * heroP + 0.5 * aboutP;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function maxRectDeltaVsAbout(
  tv: number,
  rh: DOMRect,
  ra: DOMRect
): { err: number; left: number; top: number; width: number; height: number } {
  const left = lerp(rh.left, ra.left, tv);
  const top = lerp(rh.top, ra.top, tv);
  const width = lerp(rh.width, ra.width, tv);
  const height = lerp(rh.height, ra.height, tv);
  const err = Math.max(
    Math.abs(left - ra.left),
    Math.abs(top - ra.top),
    Math.abs(width - ra.width),
    Math.abs(height - ra.height)
  );
  return { err, left, top, width, height };
}

/**
 * Sets docked when lerped overlay box matches about slot; undocks on scroll-back via t/err hysteresis.
 */
function FlightLayer({
  flightActive,
  heroSlot,
  aboutSlot,
  t,
  visible,
  dockedInAbout,
  onDockedChange,
}: {
  flightActive: boolean;
  heroSlot: HTMLElement | null;
  aboutSlot: HTMLElement | null;
  t: MotionValue<number>;
  visible: boolean;
  dockedInAbout: boolean;
  onDockedChange: (docked: boolean) => void;
}) {
  const leftMv = useMotionValue(0);
  const topMv = useMotionValue(0);
  const widthMv = useMotionValue(0);
  const heightMv = useMotionValue(0);
  const dockedRef = useRef(dockedInAbout);

  useEffect(() => {
    dockedRef.current = dockedInAbout;
  }, [dockedInAbout]);

  const syncPosition = useCallback(() => {
    if (!flightActive) {
      if (dockedRef.current) {
        dockedRef.current = false;
        onDockedChange(false);
      }
      return;
    }
    if (!heroSlot || !aboutSlot) return;

    const tv = Math.min(1, Math.max(0, t.get()));
    const rh = heroSlot.getBoundingClientRect();
    const ra = aboutSlot.getBoundingClientRect();
    const { err, left, top, width, height } = maxRectDeltaVsAbout(tv, rh, ra);

    leftMv.set(left);
    topMv.set(top);
    widthMv.set(width);
    heightMv.set(height);

    const closeEnough =
      tv >= MIN_T_TO_ALLOW_DOCK && err <= RECT_MATCH_EPS_PX;

    const nextDocked = dockedRef.current
      ? !(tv < UNDOCK_T || err > UNDOCK_ERR_PX)
      : closeEnough;

    if (nextDocked !== dockedRef.current) {
      dockedRef.current = nextDocked;
      onDockedChange(nextDocked);
    }
  }, [
    aboutSlot,
    flightActive,
    heroSlot,
    heightMv,
    leftMv,
    onDockedChange,
    t,
    topMv,
    widthMv,
  ]);

  useMotionValueEvent(t, "change", syncPosition);

  useLayoutEffect(() => {
    syncPosition();

    const rafId = window.requestAnimationFrame(syncPosition);
    return () => window.cancelAnimationFrame(rafId);
  }, [syncPosition, visible]);

  useEffect(() => {
    if (!flightActive || !heroSlot || !aboutSlot) return;

    const resizeObserver = new ResizeObserver(() => {
      syncPosition();
    });

    resizeObserver.observe(heroSlot);
    resizeObserver.observe(aboutSlot);

    const handleResize = () => {
      syncPosition();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [aboutSlot, flightActive, heroSlot, syncPosition]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-60 overflow-hidden rounded-sm shadow-lg"
      style={{
        left: leftMv,
        top: topMv,
        width: widthMv,
        height: heightMv,
      }}
    >
      <Image
        src={heroData.heroImageSrc}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
    </motion.div>
  );
}

function FlightProgressBridge({
  heroSection,
  aboutRoot,
  onReady,
}: {
  heroSection: HTMLElement;
  aboutRoot: HTMLElement;
  onReady: (t: MotionValue<number>) => void;
}) {
  const heroRef = useRef(heroSection);
  const aboutRef = useRef(aboutRoot);

  useLayoutEffect(() => {
    heroRef.current = heroSection;
    aboutRef.current = aboutRoot;
  }, [heroSection, aboutRoot]);

  const { scrollYProgress: pHero } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const { scrollYProgress: pAbout } = useScroll({
    target: aboutRef,
    offset: ["start end", "start start"],
  });

  const tRaw = useTransform([pHero, pAbout], ([h, a]) =>
    mergeFlightProgress(
      typeof h === "number" ? h : 0,
      typeof a === "number" ? a : 0
    )
  );

  const t = useSpring(tRaw, T_SPRING);

  useEffect(() => {
    onReady(t);
  }, [t, onReady]);

  return null;
}

export type HeroAboutImageCoordinatorProps = {
  children: ReactNode;
};

export function HeroAboutImageCoordinator({
  children,
}: HeroAboutImageCoordinatorProps) {
  const reduceMotion = useReducedMotion();
  const [isLg, setIsLg] = useState(false);

  const [heroSectionEl, setHeroSectionEl] = useState<HTMLElement | null>(null);
  const [aboutRootEl, setAboutRootEl] = useState<HTMLElement | null>(null);

  const [heroSlot, setHeroSlot] = useState<HTMLElement | null>(null);
  const [aboutSlot, setAboutSlot] = useState<HTMLElement | null>(null);

  const [tMotion, setTMotion] = useState<MotionValue<number> | null>(null);

  const onFlightTReady = useCallback((mv: MotionValue<number>) => {
    setTMotion(mv);
  }, []);

  useLayoutEffect(() => {
    const sync = () => {
      setHeroSectionEl(document.getElementById("hero"));
      setAboutRootEl(document.getElementById(ABOUT_SECTION_ROOT_ID));
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(LG_MEDIA_QUERY);
    const sync = () => setIsLg(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const flightActive = Boolean(isLg && !reduceMotion);

  /** Only meaningful while flight is active; UI uses `dockedInAbout` below. */
  const [rawDockedInAbout, setRawDockedInAbout] = useState(false);
  const [prevFlightActive, setPrevFlightActive] = useState(flightActive);

  const onDockedChange = useCallback((docked: boolean) => {
    setRawDockedInAbout(docked);
  }, []);

  if (prevFlightActive !== flightActive) {
    setPrevFlightActive(flightActive);
    if (!flightActive) {
      setRawDockedInAbout(false);
    }
  }

  const dockedInAbout = flightActive && rawDockedInAbout;

  const showOverlay = Boolean(
    flightActive &&
      tMotion &&
      heroSlot &&
      aboutSlot &&
      heroSectionEl &&
      aboutRootEl &&
      !dockedInAbout
  );

  const contextValue = useMemo(
    () => ({
      flightActive,
      dockedInAbout,
      registerHeroSlot: (el: HTMLElement | null) => setHeroSlot(el),
      registerAboutSlot: (el: HTMLElement | null) => setAboutSlot(el),
    }),
    [flightActive, dockedInAbout]
  );

  return (
    <HeroAboutImageContextProvider value={contextValue}>
      {children}
      {flightActive && heroSectionEl && aboutRootEl ? (
        <FlightProgressBridge
          heroSection={heroSectionEl}
          aboutRoot={aboutRootEl}
          onReady={onFlightTReady}
        />
      ) : null}
      {flightActive && tMotion ? (
        <FlightLayer
          flightActive={flightActive}
          heroSlot={heroSlot}
          aboutSlot={aboutSlot}
          t={tMotion}
          visible={showOverlay}
          dockedInAbout={dockedInAbout}
          onDockedChange={onDockedChange}
        />
      ) : null}
    </HeroAboutImageContextProvider>
  );
}
