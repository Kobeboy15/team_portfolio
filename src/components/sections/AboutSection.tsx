import { aboutData } from "../../data/about";

import { ImageFrame } from "../ui/ImageFrame";
import { Section } from "../ui/Section";

import { AboutBio } from "./AboutBio";
import { AboutPoints } from "./AboutPoints";

export function AboutSection() {
  return (
    <Section id="about" spacing="lg">
        {/* TODO: Implement horizontal scrolling */}
        <div className="horizontal-scroll">
            {/* Heading + Bio */}
            <AboutBio />

            {/* Points */}
            <ImageFrame
                placement="about-points"
                src={aboutData.pointsImage}
                alt={aboutData.pointsImageAlt}
            />
            <AboutPoints />

            <ImageFrame
                placement="about-separator"
                src={aboutData.separatorImage}
                alt={aboutData.separatorImageAlt}
            />
            {/* Gallery placeholder */}
            <div>
                {/* TODO: Horizontal storytelling gallery goes here */}
            </div>
        </div>
    </Section>
  );
}