"use client";

import Image from "next/image";
import {
  useAnimationFrame,
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

function mergeFlightProgress(heroP: number, aboutP: number): number {
  return 0.5 * heroP + 0.5 * aboutP;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function FlightLayer({
  heroSlot,
  aboutSlot,
  t,
  visible,
}: {
  heroSlot: HTMLElement | null;
  aboutSlot: HTMLElement | null;
  t: MotionValue<number>;
  visible: boolean;
}) {
  const leftMv = useMotionValue(0);
  const topMv = useMotionValue(0);
  const widthMv = useMotionValue(0);
  const heightMv = useMotionValue(0);

  useAnimationFrame(() => {
    if (!visible || !heroSlot || !aboutSlot) return;
    const tv = Math.min(1, Math.max(0, t.get()));
    const rh = heroSlot.getBoundingClientRect();
    const ra = aboutSlot.getBoundingClientRect();
    leftMv.set(lerp(rh.left, ra.left, tv));
    topMv.set(lerp(rh.top, ra.top, tv));
    widthMv.set(lerp(rh.width, ra.width, tv));
    heightMv.set(lerp(rh.height, ra.height, tv));
  });

  useMotionValueEvent(t, "change", () => {
    if (!visible || !heroSlot || !aboutSlot) return;
    const tv = Math.min(1, Math.max(0, t.get()));
    const rh = heroSlot.getBoundingClientRect();
    const ra = aboutSlot.getBoundingClientRect();
    leftMv.set(lerp(rh.left, ra.left, tv));
    topMv.set(lerp(rh.top, ra.top, tv));
    widthMv.set(lerp(rh.width, ra.width, tv));
    heightMv.set(lerp(rh.height, ra.height, tv));
  });

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

  const dockedInAbout = flightActive && rawDockedInAbout;

  useEffect(() => {
    if (!flightActive || !tMotion) return;
    const onChange = (v: number) => {
      setRawDockedInAbout((d) => {
        if (v >= 0.97) return true;
        if (v < 0.9) return false;
        return d;
      });
    };
    onChange(tMotion.get());
    const unsub = tMotion.on("change", onChange);
    return () => unsub();
  }, [flightActive, tMotion]);

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
          heroSlot={heroSlot}
          aboutSlot={aboutSlot}
          t={tMotion}
          visible={showOverlay}
        />
      ) : null}
    </HeroAboutImageContextProvider>
  );
}
