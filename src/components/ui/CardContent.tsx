"use client"

import { BentoContent } from "@/src/types/skills";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function CardContent({ content }: { content: BentoContent }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

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
            <div className="w-full h-full flex flex-col items-center justify-center px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-5 lg:py-5 gap-2 md:gap-3">
                <div className="w-full flex flex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 py-1 sm:py-2 md:py-3">
                    {
                    content.icons.map((icon, i) => (
                        <div key={i} className="overflow-hidden rounded-[10px] px-3 py-3 sm:px-4 sm:py-4 md:p-5 lg:p-7" style={{ background: `linear-gradient(to bottom, var(--token-background) 50%, var(--token-background-2) 100%)` }}>
                            <img src={icon.path} alt={icon.name} className={`w-8 h-8 sm:w-10 sm:h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 ${invertClass}`} />
                        </div>
                    ))}
                </div>
                {(content.heading || content.caption) &&
                <div className="font-sora flex flex-col w-full px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-5 lg:py-5 gap-2 md:gap-3 text-sm md:text-base lg:text-lg">
                    {content.heading && <h3 className="text-(--token-accent)">{content.heading}</h3>}
                    {content.caption && <p className="text-(--token-foreground)">{content.caption}</p>}
                </div>
                }
            </div>
        );
  }
}
