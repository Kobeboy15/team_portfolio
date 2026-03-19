import { Section } from "../ui/Section";

import { Button } from "../ui/Button";
import { ImageFrame } from "../ui/ImageFrame";

export function HeroSection() {
  return (
    <Section id="hero" navHeight="72px">
      <div className="flex flex-col h-full">

        <div className="flex flex-col items-center sm:items-start justify-start pt-2 lg:pt-0">
          <h1 className="text-header-1 tracking-display font-bebas whitespace-nowrap">Kobe Michael</h1>
          <h2 className="text-header-2  tracking-display font-bebas text-center sm:text-left text-accent whitespace-nowrap">Front-End Developer</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-1">
          <div className="flex flex-col items-end sm:items-start justify-start px-3 pt-20 sm:pl-3 md:pl-4 lg:pl-9 sm:pr-2 md:pr-3 lg:pr-5 xl:pr-7 gap-y-2 sm:gap-y-4">
            <p className="text-sora-18 ">
              I&apos;m a software engineer with a passion for building web applications that are not only functional but also beautiful and easy to
              use.
            </p>
            <Button
              href="#contact"
              icon={
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.25 11.25L11.25 1.25M11.25 1.25H1.25M11.25 1.25V11.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            >
              Contact me
            </Button>
          </div>

          <div className="relative w-full sm:w-[380px] sm:h-[450px] md:w-[420px] md:h-[500px] lg:w-[620px] lg:h-[465px] xl:w-[773px] xl:h-[580px] xl:shrink-0 aspect-[773/580] xl:aspect-auto px-3 sm:px-0 lg:pr-15 xl:pr-22">
            <ImageFrame
              placement="hero"
              src="/images/hero/hero-image.webp"
              alt="Hero image"
              className="h-full w-full object-cover sm:relative sm:bottom-5 lg:bottom-6 xl:bottom-8"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
