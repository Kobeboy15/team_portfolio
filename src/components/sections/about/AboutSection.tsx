"use client";

import { useRef, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

import { aboutData } from "../../../data/about";
import { useClientMounted } from "../../../hooks/useClientMounted";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { isLikelyIosAffectedWebKit } from "../../../lib/isLikelyIosAffectedWebKit";
import {
  ANCHOR_OFFSET_ATTRIBUTE,
  DEFAULT_SECTION_ANCHOR_OFFSET_PX,
} from "../../../lib/scrollAnchors";

import { ABOUT_SECTION_ANCHOR_ID, ABOUT_SECTION_ROOT_ID } from "../heroAboutConstants";
import { ScrollProgressBar } from "../../ui/ScrollProgressBar";
import { Section } from "../../ui/Section";
import { useOptionalHomepageReadiness } from "../../homepage/HomepageReadinessProvider";

import { AboutBio } from "./AboutBio";
import { AboutGallery } from "./AboutGallery";
import { AboutPoints } from "./AboutPoints";
import { AboutSeparatorParallax } from "./AboutSeparatorParallax";
import { useDesktopSeparatorTrackMetrics } from "./useDesktopSeparatorTrackMetrics";

const DESKTOP_ABOUT_SCROLL_ID = "about-desktop-scroll-area";
const ABOUT_DESKTOP_MEDIA_QUERY = "(min-width: 640px)";
const subscribeToPlatformSnapshot = () => () => {};

function useStableMobileMediaHeightForIos() {
  return useSyncExternalStore(
    subscribeToPlatformSnapshot,
    isLikelyIosAffectedWebKit,
    () => false,
  );
}

function AboutSectionShell() {
  return <div aria-hidden="true" className="min-h-screen w-full pt-18" />;
}

function DesktopAboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const uniqueSeparatorRef = useRef<HTMLElement>(null);
  const [translateX, setTranslateX] = useState("0%");
  const [scrollHeight, setScrollHeight] = useState("300vh");
  const [totalScrollPx, setTotalScrollPx] = useState(0);
  const uniqueSeparatorMetrics = useDesktopSeparatorTrackMetrics(uniqueSeparatorRef, true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const calculateTranslate = () => {
      if (!contentRef.current) return;

      const totalWidth = contentRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = Math.max(0, totalWidth - viewportWidth);
      setTotalScrollPx(scrollDistance);
      const percentage = totalWidth > 0 ? (scrollDistance / totalWidth) * 100 : 0;
      setTranslateX(`-${percentage}%`);

      const speedMod = window.innerWidth < 640 ? 0.75 : 1;
      setScrollHeight(`${(scrollDistance * speedMod) + window.innerHeight}px`);
    };

    calculateTranslate();

    const resizeObserver = new ResizeObserver(calculateTranslate);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    window.addEventListener("resize", calculateTranslate);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", calculateTranslate);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], ["0%", translateX]);

  return (
    <div
      ref={sectionRef}
      id={DESKTOP_ABOUT_SCROLL_ID}
      className="relative w-full"
      style={{ height: scrollHeight }}
    >
      <Section className="sticky top-0 w-full max-w-none max-h-dvh overflow-hidden pt-0!">
        <motion.div ref={contentRef} data-scroll-container style={{ x }} className="flex flex-nowrap w-max max-h-full">
          <AboutBio />
          <section
            ref={uniqueSeparatorRef}
            className="relative h-dvh w-[70vw] shrink-0 overflow-hidden"
            aria-label={aboutData.pointsImageAlt}
          >
            <AboutSeparatorParallax
              src={aboutData.pointsImage}
              alt={aboutData.pointsImageAlt}
              orientation="horizontal"
              scrollYProgress={scrollYProgress}
              totalScrollWidth={totalScrollPx}
              desktopTrackMetrics={uniqueSeparatorMetrics}
            />
          </section>
          <AboutPoints />
          <AboutGallery idNamespace="desktop" scrollYProgress={scrollYProgress} totalScrollWidth={totalScrollPx} />
        </motion.div>
      </Section>
      <ScrollProgressBar scrollYProgress={scrollYProgress} targetId={DESKTOP_ABOUT_SCROLL_ID} />
    </div>
  );
}

function MobileAboutSection() {
  const useStableMobileMediaHeight = useStableMobileMediaHeightForIos();

  const mobileImageHeightClass = useStableMobileMediaHeight
    ? "relative h-[clamp(320px,70svh,960px)] w-full overflow-hidden"
    : "relative h-[clamp(320px,70dvh,960px)] w-full overflow-hidden";

  return (
    <Section className="block w-full max-w-none overflow-hidden pt-0!">
      <AboutBio />
      <section className={mobileImageHeightClass} aria-label={aboutData.pointsImageAlt}>
        <AboutSeparatorParallax
          src={aboutData.pointsImage}
          alt={aboutData.pointsImageAlt}
          orientation="vertical"
        />
      </section>
      <AboutPoints />
      <AboutGallery
        idNamespace="mobile"
        orientation="vertical"
        useStableMobileMediaHeight={useStableMobileMediaHeight}
      />
    </Section>
  );
}

export function AboutSection() {
  const isClientMounted = useClientMounted();
  const isDesktop = useMediaQuery(ABOUT_DESKTOP_MEDIA_QUERY);
  const readiness = useOptionalHomepageReadiness();

  useEffect(() => {
    if (!isClientMounted || !readiness) return;

    readiness.markReady("layout-mode-ready", isDesktop ? "desktop" : "mobile");
  }, [isClientMounted, isDesktop, readiness]);

  let content: ReactNode = <AboutSectionShell />;

  if (isClientMounted) {
    content = isDesktop ? <DesktopAboutSection /> : <MobileAboutSection />;
  }

  useEffect(() => {
    if (!isClientMounted) return;
    readiness?.markReady("about-mounted");
  }, [isClientMounted, readiness]);

  return (
    <div id={ABOUT_SECTION_ROOT_ID} className="relative w-full">
      <div
        id={ABOUT_SECTION_ANCHOR_ID}
        className="absolute top-0"
        aria-hidden="true"
        {...{ [ANCHOR_OFFSET_ATTRIBUTE]: DEFAULT_SECTION_ANCHOR_OFFSET_PX }}
      />
      {content}
    </div>
  );
}
