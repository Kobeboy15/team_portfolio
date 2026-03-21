import { Section } from "../ui/Section";

import { Button } from "../ui/Button";
import { ImageFrame } from "../ui/ImageFrame";

import { heroData } from "../../data/hero";

export function HeroSection() {
  return (
    <Section id="hero" navHeight="72px" className="pt-18 w-full h-screen flex items-center justify-center">
      <div className="flex flex-col w-full h-full max-h-[1080px]">
        {/* Hero Name and Role Phrases */}
        <div className="flex flex-col items-center sm:items-start justify-start pt-2 lg:pt-0 sm:pl-1">
          <h1 className="w-full text-header-1 tracking-display font-bebas whitespace-nowrap">{heroData.name}</h1>
          <h2 className="w-full text-header-2  tracking-display font-bebas text-center sm:text-left text-accent whitespace-nowrap">
            {heroData.rolePhrases[0]}
          </h2>
        </div>

        {/* Hero Bio and CTA */}
        <div className="flex flex-col sm:flex-row sm:flex-1 xl:justify-between">
          <div className="flex flex-col items-end sm:items-start justify-start max-w-[800px] px-3 pt-20 sm:pl-3 md:pl-4 lg:pl-9 sm:pr-2 md:pr-3 lg:pr-5 xl:pr-7 gap-y-2 sm:gap-y-4">
            <p className="text-sora-18">{heroData.bio}</p>
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
              {heroData.ctaLabel}
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative w-full sm:w-[380px] sm:h-[450px] md:w-[420px] md:h-[500px] lg:w-[620px] lg:h-[465px] xl:w-[773px] xl:h-[580px] xl:shrink-0 aspect-773/580 xl:aspect-auto px-3 sm:px-0 lg:pr-15 xl:pr-22 2xl:w-fit 2xl:h-auto 2xl:max-w-2/3">
            <ImageFrame
              placement="hero"
              src={heroData.heroImageSrc}
              alt={heroData.heroImageAlt}
              className="h-full w-full object-cover sm:relative sm:bottom-5 lg:bottom-6 xl:bottom-8"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
