"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

import { aboutData } from "../../data/about";

import { ImageFrame } from "../ui/ImageFrame";
import { Section } from "../ui/Section";

import { AboutBio } from "./AboutBio";
import { AboutGallery } from "./AboutGallery";
import { AboutPoints } from "./AboutPoints";

export function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-76%"]); // TODO: calculate dynamically

  return (
    <div ref={sectionRef} className="relative w-full" style={{ height: "300vh" }}>
        <Section id="about" className="sticky top-0 w-full max-w-none pt-0!">
            <motion.div style={{ x }} className="flex flex-nowrap w-max">
                {/* Heading + Bio */}
                <AboutBio />

                {/* Points */}
                <ImageFrame
                    placement="about-points"
                    src={aboutData.pointsImage}
                    alt={aboutData.pointsImageAlt}
                />
                <AboutPoints />

                <AboutGallery />
            </motion.div>
        </Section>
    </div>
  );
}