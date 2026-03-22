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
      return <div className="font-sora text-sora-13 md:text-sora-24 font-bold text-(--token-accent) w-full h-full flex justify-center items-center p-5 md:p-20">{content.value}</div>;
    case "sub-heading":
      return <div className="font-sora text-[0.5rem] md:text-sora-14 font-bold text-(--token-accent) w-full h-full flex justify-center items-center p-2 md:p-5">{content.value}</div>;
    case "paragraph":
      return (
            <div className="font-sora text-[0.5rem] md:text-sora-14 flex flex-col px-2 md:px-5 py-5 md:py-7">
                {content.heading && <h3 className="text-(--token-accent) mb-2">{content.heading}</h3>}
                <p className="text-(--token-foreground)">{content.value}</p>
            </div>
        );
    case "icon":
      return (
            <div className="w-full h-full flex flex-col md:flex-row justify-center items-center">
                <img src={content.icon.path} alt={content.icon.name} className={`w-10 h-10 ${invertClass}`} />
                <span className="font-sora text-sora-14 md:text-sora-32 text-(--token-foreground)">{content.icon.name}</span>
            </div>
        );
    case "icon-carousel":
      return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4">
                    {
                    content.icons.map((icon, i) => (
                        <div key={i} className="overflow-hidden rounded-[10px] px-5 py-4 md:p-7 " style={{ background: `linear-gradient(to bottom, var(--token-background) 50%, var(--token-background-2) 100%)` }}>
                            <img src={icon.path} alt={icon.name} className={`w-5 md:w-20 h-5 md:h-20 ${invertClass}`} />
                        </div>
                    ))}
                </div>
                {(content.heading || content.caption) &&
                <div className="p-2 md:p-10 font-sora text-[0.5rem] md:text-sora-14">
                    {content.heading && <h3 className="text-(--token-accent)">{content.heading}</h3>}
                    {content.caption && <p className="text-(--token-foreground)">{content.caption}</p>}
                </div>
                }
            </div>
        );
  }
}