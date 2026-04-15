import { NavigationHeader } from "../components/ui/NavigationHeader";

import { HeroAboutImageCoordinator } from "../components/sections/HeroAboutImageCoordinator";
import { HeroSection } from "../components/sections/HeroSection";
import { AboutSection } from "../components/sections/about/AboutSection";
import { SkillsSection } from "../components/sections/SkillsSection";
import { ProjectsSection } from "../components/sections/ProjectsSection";
import { ContactSection } from "../components/sections/ContactSection";

import {
  ButtonTestSection,
  CardTestSection,
  HeadingTestSection,
  ImageFrameTestSection,
} from "../components/test-components";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <NavigationHeader />
      <main className="flex min-h-screen w-full flex-col items-center justify-between">
        <HeroAboutImageCoordinator>
          <HeroSection />
          <AboutSection />
        </HeroAboutImageCoordinator>
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </div>
  );
}
