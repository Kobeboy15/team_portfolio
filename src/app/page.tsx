import { NavigationHeader } from "../components/ui/NavigationHeader";

import { HeroSection } from "../components/sections/HeroSection";
import { AboutSection } from "../components/sections/AboutSection";
import { SkillsSection } from "../components/sections/SkillsSection";

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
        <HeroSection />

        {/* Test sections for development purposes */}
        {/* <ButtonTestSection />
        <HeadingTestSection />
        <CardTestSection />
        <ImageFrameTestSection /> */}
        <AboutSection />
        <SkillsSection />
      </main>
    </div>
  );
}
