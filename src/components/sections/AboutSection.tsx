"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

import { aboutData } from "../../data/about";

import { ImageFrame } from "../ui/ImageFrame";
import { Section } from "../ui/Section";

import { AboutBio } from "./AboutBio";
import { AboutGallery } from "./AboutGallery";
import { AboutPoints } from "./AboutPoints";

export function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [translateX, setTranslateX] = useState("0%");

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    useEffect(() => {
        const calculateTranslate = () => {
            if (!contentRef.current) return;

            const totalWidth = contentRef.current.scrollWidth;
            const viewportWidth = window.innerWidth;
            const scrollDistance = totalWidth - viewportWidth;
            const percentage = (scrollDistance / totalWidth) * 100;
            setTranslateX(`-${percentage}%`);
        };

        calculateTranslate();

        const resizeObserver = new ResizeObserver(calculateTranslate);
        if (contentRef.current) resizeObserver.observe(contentRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    const x = useTransform(scrollYProgress, [0, 1], ["0%", translateX]);

  return (
    <div ref={sectionRef} className="relative w-full" style={{ height: "300vh" }}>
        <Section id="about" className="sticky top-0 w-full max-w-none pt-0! overflow-hidden">
            <motion.div ref={contentRef} style={{ x }} className="flex flex-nowrap w-max max-h-dvh">
                {/* Heading + Bio */}
                <AboutBio />

                {/* Points */}
                <ImageFrame
                    placement="about-points"
                    src={aboutData.pointsImage}
                    alt={aboutData.pointsImageAlt}
                    className="w-screen max-w-[594px] h-auto"
                />
                <AboutPoints />

                <AboutGallery />
            </motion.div>
        </Section>
    </div>
  );
}