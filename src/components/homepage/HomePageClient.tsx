"use client";

import { AboutSection } from "../sections/about/AboutSection";
import { ContactSection } from "../sections/ContactSection";
import { HeroAboutImageCoordinator } from "../sections/HeroAboutImageCoordinator";
import { HeroSection } from "../sections/HeroSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { SkillsSection } from "../sections/SkillsSection";
import { NavigationHeader } from "../ui/NavigationHeader";
import { navigationData } from "../../data/navigation";

import { HomepageReadinessProvider, useHomepageReadiness } from "./HomepageReadinessProvider";
import { InitialPageLoader } from "./InitialPageLoader";

function HomePageContent() {
  const { dismiss, isBlocking, isReady, progress } = useHomepageReadiness();

  return (
    <>
      <InitialPageLoader
        isBlocking={isBlocking}
        isReady={isReady}
        onDismiss={dismiss}
        progress={progress}
      />

      <div className="min-h-screen bg-background font-sans">
        <div inert={isBlocking} className={isBlocking ? "pointer-events-none" : undefined}>
          <NavigationHeader
            brandName={navigationData.brandName}
            brandHref={navigationData.brandHref}
            navItems={navigationData.navItems}
          />
          <main className="flex min-h-screen w-full flex-col items-center justify-between pointer-events-auto">
            <HeroAboutImageCoordinator>
              <HeroSection />
              <AboutSection />
            </HeroAboutImageCoordinator>
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
          </main>
        </div>
      </div>
    </>
  );
}

export function HomePageClient() {
  return (
    <HomepageReadinessProvider>
      <HomePageContent />
    </HomepageReadinessProvider>
  );
}
