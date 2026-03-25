import { aboutData } from "../../data/about";

import { ImageFrame } from "../ui/ImageFrame";
import { Section } from "../ui/Section";

import { AboutBio } from "./AboutBio";
import { AboutGallery } from "./AboutGallery";
import { AboutPoints } from "./AboutPoints";

export function AboutSection() {
  return (
    <Section id="about" spacing="lg" className="w-full max-w-none">
        <div className="w-full self-stretch">
            {/* Heading + Bio */}
            <AboutBio />

            {/* Points */}
            <ImageFrame
                placement="about-points"
                src={aboutData.pointsImage}
                alt={aboutData.pointsImageAlt}
            />
            <AboutPoints />

            {/* <ImageFrame
                placement="about-separator"
                src={aboutData.separatorImage}
                alt={aboutData.separatorImageAlt}
            /> */}
            <AboutGallery />
        </div>
    </Section>
  );
}