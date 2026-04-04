"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "framer-motion";

import type { Project } from "../../types/projects";

import { ProjectCardDesktop } from "./ProjectCardDesktop";

const NAV_OFFSET_PX = 72;

export type DesktopStickyProjectsProps = {
  projects: Project[];
};

export function DesktopStickyProjects({ projects }: DesktopStickyProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const n = projects.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (n <= 0) return;

    const sync = () => {
      const latest = scrollYProgress.get();
      setActiveIndex(Math.min(n - 1, Math.max(0, Math.floor(latest * n))));
    };

    sync();
    return scrollYProgress.on("change", sync);
  }, [scrollYProgress, n]);

  if (n === 0) {
    return null;
  }

  const activeProject = projects[activeIndex] ?? projects[0];

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${n * 100}dvh` }}
    >
      <div
        className="sticky flex w-full items-center justify-center"
        style={{
          top: NAV_OFFSET_PX,
          height: `calc(100dvh - ${NAV_OFFSET_PX}px)`,
        }}
      >
        <ProjectCardDesktop project={activeProject} className="w-full" />
      </div>
    </div>
  );
}
