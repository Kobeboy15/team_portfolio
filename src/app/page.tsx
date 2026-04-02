import { NavigationHeader } from "../components/ui/NavigationHeader";

import { HeroSection } from "../components/sections/HeroSection";
import { AboutSection } from "../components/sections/about/AboutSection";
import { SkillsSection } from "../components/sections/SkillsSection";
import { ProjectsSection } from "../components/sections/ProjectsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <NavigationHeader />
      <main className="flex min-h-screen w-full flex-col items-center justify-between">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
      </main>
    </div>
  );
}
