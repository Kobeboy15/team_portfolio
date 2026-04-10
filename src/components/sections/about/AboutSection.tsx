"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

import { aboutData } from "../../../data/about";

import { ImageFrame } from "../../ui/ImageFrame";
import { ScrollProgressBar } from "../../ui/ScrollProgressBar";
import { Section } from "../../ui/Section";

import { AboutBio } from "./AboutBio";
import { AboutGallery } from "./AboutGallery";
import { AboutPoints } from "./AboutPoints";

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState("0%");
  const [scrollHeight, setScrollHeight] = useState("300vh");
  const [totalScrollPx, setTotalScrollPx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: imageRevealProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
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

      const isMobile = window.innerWidth < 768;
      const speedMod = isMobile ? 0.75 : 1;
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
    <div ref={sectionRef} className="relative w-full" style={{ height: scrollHeight }}>
      <Section id="about" className="sticky top-0 w-full max-w-none max-h-dvh overflow-hidden pt-0!">
        <motion.div ref={contentRef} data-scroll-container style={{ x }} className="flex flex-nowrap w-max max-h-full">
          {/* Heading + Bio */}
          <AboutBio imageRevealProgress={imageRevealProgress} />

          {/* Points */}
          <section className="relative h-dvh w-[70vw] shrink-0 overflow-hidden" aria-label={aboutData.pointsImageAlt}>
            <div className="relative h-full w-full overflow-hidden">
              <ImageFrame placement="about-gallery-hero" src={aboutData.pointsImage} alt={aboutData.pointsImageAlt} />
            </div>
          </section>
          <AboutPoints />

          {/* Gallery */}
          <AboutGallery scrollYProgress={scrollYProgress} totalScrollWidth={totalScrollPx} />
        </motion.div>
      </Section>
      <ScrollProgressBar scrollYProgress={scrollYProgress} targetId="about" />
    </div>
  );
}
