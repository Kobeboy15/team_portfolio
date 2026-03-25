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
      return <div className="font-sora font-bold text-(--token-accent) w-full h-full flex justify-center items-center p-5 md:p-[1.5em] text-xl md:text-2xl lg:text-3xl">{content.value}</div>;
    case "sub-heading":
      return <div className="font-sora font-bold text-(--token-accent) w-full h-full flex justify-center items-center p-2 md:p-5 text-sm md:text-base lg:text-lg">{content.value}</div>;
    case "paragraph":
      return (
            <div className="font-sora flex flex-col px-2 md:px-[0.75em] py-2 md:py-[1.25em] text-sm md:text-base lg:text-lg">
                {content.heading && <h3 className="text-(--token-accent) mb-2">{content.heading}</h3>}
                <p className="text-(--token-foreground)">{content.value}</p>
            </div>
        );
    case "icon":
      return (
            <div className="w-full h-full flex flex-col md:flex-row justify-center items-center">
                <img src={content.icon.path} alt={content.icon.name} className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${invertClass}`} />
                <span className="font-sora text-lg md:text-4xl text-(--token-foreground)">{content.icon.name}</span>
            </div>
        );
    case "icon-carousel":
      return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                    {
                    content.icons.map((icon, i) => (
                        <div key={i} className="overflow-hidden rounded-[10px] px-5 py-4 md:p-7 " style={{ background: `linear-gradient(to bottom, var(--token-background) 50%, var(--token-background-2) 100%)` }}>
                            <img src={icon.path} alt={icon.name} className={`w-8 h-8 md:w-15 md:h-15 lg:w-20 lg:h-20 ${invertClass}`} />
                        </div>
                    ))}
                </div>
                {(content.heading || content.caption) &&
                <div className="p-2 md:p-10 font-sora text-sm md:text-base lg:text-lg">
                    {content.heading && <h3 className="text-(--token-accent)">{content.heading}</h3>}
                    {content.caption && <p className="text-(--token-foreground)">{content.caption}</p>}
                </div>
                }
            </div>
        );
  }
}