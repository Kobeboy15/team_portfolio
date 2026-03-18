import Image from "next/image";
import { Section } from "../components/ui/Section";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Button } from "../components/ui/Button";
import { Heading } from "../components/ui/Heading";
import { Card } from "../components/ui/Card";
import { ImageFrame } from "../components/ui/ImageFrame";
import { NavigationHeader } from "../components/ui/NavigationHeader";

import { HeroSection } from "../components/sections/HeroSection";
import { AboutSection } from "../components/sections/AboutSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <NavigationHeader />
      <HeroSection />
      <Section spacing="lg" withSectionGap className="flex min-h-screen items-center justify-center">
        <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between bg-background py-32 px-8 sm:items-start">
          <div className="mb-6 self-end">
            <ThemeToggle />
          </div>

          {/* Temporary section for testing the Button component */}
          <section className="mt-10 flex w-full flex-col gap-4 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground">Button Component Testing</h2>
            <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
              <Button
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Button>
              <Button
                href="#top"
                icon={
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 16V2M9 2L2 9M9 2L16 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              >
                Go up
              </Button>
            </div>
          </section>

          {/* Temporary section for testing the Heading component */}
          <section className="mt-10 flex w-full flex-col gap-6 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground">Heading Component Testing</h2>
            <div className="flex flex-col gap-8">
              <Heading as="h2" size="hero-1" tone="foreground">
                Hero 1
              </Heading>
              <Heading as="h2" size="hero-2" tone="accent">
                Hero 2
              </Heading>
              <Heading as="h2" size="display-128" tone="foreground-secondary">
                Display 128
              </Heading>
              <Heading as="h2" size="display-96" tone="accent">
                Display 96
              </Heading>
              <Heading as="h2" size="display-48" tone="accent">
                Display 48
              </Heading>
              <Heading as="h2" size="years" tone="foreground">
                Years
              </Heading>
            </div>
          </section>

          {/* Temporary section for testing the Card component */}
          <section className="mt-10 flex w-full flex-col gap-6 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground">Card Component Testing</h2>
            <div className="flex flex-wrap gap-4">
              <Card size="4" variant="background2">
                <div className="flex h-full items-center justify-center p-4 text-foreground">background2</div>
              </Card>
              <Card size="4" variant="accent">
                <div className="flex h-full items-center justify-center p-4 text-accent-foreground">accent</div>
              </Card>
              <Card size="4" variant="gradient">
                <div className="flex h-full items-center justify-center p-4 text-foreground">gradient</div>
              </Card>
            </div>
            <div className="flex flex-wrap gap-4">
              {(["1", "2", "3", "4", "5", "6", "7"] as const).map((size) => (
                <Card key={size} size={size} variant="background2">
                  <div className="flex h-full items-center justify-center p-4 text-sm text-foreground">{size}</div>
                </Card>
              ))}
            </div>
          </section>

          {/* Temporary section for testing the ImageFrame component */}
          <section className="mt-10 flex w-full flex-col gap-6 border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground">Image Frame Component Testing</h2>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-foreground">hero</span>
                <ImageFrame placement="hero" src="https://picsum.photos/773/580" alt="Hero (test)" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-foreground">about</span>
                <ImageFrame placement="about" src="https://picsum.photos/594/640" alt="About (test)" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-foreground">about-points</span>
                <ImageFrame placement="about-points" src="https://picsum.photos/594/700" alt="About points (test)" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-foreground">about-separator</span>
                <ImageFrame placement="about-separator" src="https://picsum.photos/996/700" alt="About separator (test)" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-foreground">timeline</span>
                <ImageFrame placement="timeline" src="https://picsum.photos/600/400" alt="Timeline (test)" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-foreground">projects</span>
                <ImageFrame placement="projects" src="https://picsum.photos/443/591" alt="Projects (test)" />
              </div>
            </div>
          </section>
        </main>
      </Section>
      <AboutSection />
    </div>
  );
}
