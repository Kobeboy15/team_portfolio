"use client"

import { BentoContent } from "@/src/types/skills";
import { useTheme } from "next-themes";

import { useClientMounted } from "@/src/hooks/useClientMounted";
import { IconCarouselCard } from "./IconCarouselCard";

export function CardContent({ content }: { content: BentoContent }) {
    const mounted = useClientMounted();

    const { resolvedTheme } = useTheme();

    const invertClass = mounted && resolvedTheme === "dark" ? "invert" : "";

  switch (content.type) {
    case "heading":
      return <div className="font-sora font-bold text-(--token-accent) w-full h-full flex justify-center items-center p-3 sm:p-4 md:p-5 lg:p-6 text-lg sm:text-xl md:text-2xl lg:text-3xl">{content.value}</div>;
    case "sub-heading":
      return <div className="font-sora font-bold text-(--token-accent) w-full h-full flex justify-center items-center p-2 sm:p-3 md:p-4 lg:p-5 text-sm md:text-base lg:text-lg">{content.value}</div>;
    case "paragraph":
      return (
            <div className="font-sora flex flex-col px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-6 lg:px-6 lg:py-7 gap-2 md:gap-3 text-sm md:text-base lg:text-lg">
                {content.heading && <h3 className="text-(--token-accent)">{content.heading}</h3>}
                <p className="text-(--token-foreground)">{content.value}</p>
            </div>
        );
    case "icon":
      return (
            <div className="w-full h-full flex flex-col md:flex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
                <img src={content.icon.path} alt={content.icon.name} className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 ${invertClass}`} />
                <span className="font-sora text-base sm:text-lg md:text-3xl lg:text-4xl text-(--token-foreground)">{content.icon.name}</span>
            </div>
        );
    case "icon-carousel":
      return (
            <IconCarouselCard
                icons={content.icons}
                heading={content.heading}
                caption={content.caption}
                invertClass={invertClass}
            />
        );
  }
}
