import { Section } from "../ui/Section";

import { Button } from "../ui/Button";
import { ImageFrame } from "../ui/ImageFrame";

export function HeroSection() {
  return (
    <Section id="hero" navHeight="72px">
      <div className="flex flex-col items-start justify-start">
        <h1 className="md:text-header-1 font-bebas">Kobe Michael</h1>
        <h2 className="md:text-header-2 font-bebas text-accent">Front-End Developer</h2>
      </div>
      <div className="flex flex-col items-start justify-start relative top-20 left-9 w-[520px] gap-y-4">
        <p>
          I&apos;m a software engineer with a passion for building web applications that are not only functional but also beautiful and easy to use.
        </p>
        <Button
          href="#contact"
          icon={
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.25 11.25L11.25 1.25M11.25 1.25H1.25M11.25 1.25V11.25"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
        >
          Contact me
        </Button>
      </div>

      <div className="absolute top-[270px] right-[86PX] h-[580px] w-[773px]">
        <ImageFrame 
            placement="hero"
            src="/images/hero/hero-image.webp"
            alt="Hero image"
            className="h-full w-full object-cover"
        />
      </div>
    </Section>
  );
}
