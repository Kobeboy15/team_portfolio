"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { useTransform, motion, MotionValue } from "framer-motion";
import type { AboutSlide } from "../../../types/about";
import { AboutGallerySlide } from "./AboutGallerySlide";

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

type AboutGalleryWallProps = {
  year: string;
  yearId: string;
  backgroundClassName: string;
  items: AboutSlide[];
  scrollYProgress: MotionValue<number>;
  totalScrollWidth: number;
};

export function AboutGalleryWall({
  year,
  yearId,
  backgroundClassName,
  items,
  scrollYProgress,
  totalScrollWidth,
}: AboutGalleryWallProps) {
  const wallRef = useRef<HTMLElement>(null);
  const [wallData, setWallData] = useState({ offsetLeft: 0, width: 0 });
  const yearRef = useRef<HTMLHeadingElement>(null);
  const [yearWidth, setYearWidth] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (yearRef.current) {
        setYearWidth(yearRef.current.offsetWidth);
      }
      if (wallRef.current) {
        setWallData({
          offsetLeft: wallRef.current.offsetLeft,
          width: wallRef.current.offsetWidth,
        });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (yearRef.current) ro.observe(yearRef.current);
    if (wallRef.current) ro.observe(wallRef.current);
    return () => ro.disconnect();
  }, []);

  const { offsetLeft, width } = wallData;

    const availableTravel = Math.max(0, width - yearWidth - 100);
    const remainingTrack = Math.max(0, totalScrollWidth - offsetLeft);
    const clampedWidth = Math.min(availableTravel, remainingTrack);

  const enter = totalScrollWidth > 0 ? offsetLeft / totalScrollWidth : 0;
  const exit = totalScrollWidth > 0 ? (offsetLeft + clampedWidth) / totalScrollWidth : 1;

  const yearX = useTransform(
    scrollYProgress,
    [0, enter, exit, 1],
    [0, 0, clampedWidth, clampedWidth],
  );

  return (
    <section
      ref={wallRef}
      className={cn(
        "flex relative h-full w-max min-h-0 shrink-0 flex-row items-center text-foreground",
        "pl-6 md:pl-12 2xl:pl-20 pr-16 md:pr-28 lg:pr-44 2xl:pr-72 gap-16",
        backgroundClassName,
      )}
      aria-labelledby={yearId}
    >
      {/* Space placeholder for the year */}
      <div className="block w-[305px] lg:w-[330px]" />

      <motion.h2
        id={yearId}
        style={{ x: yearX }}
        ref={yearRef}
        className={cn(
          "absolute left-2 md:left-20 bottom-0 md:bottom-6 shrink-0 font-bebas uppercase z-0",
          "text-display-96 md:text-years leading-(--text-years--line-height) tracking-years",
        )}
      >
        {year}
      </motion.h2>

      <div className="flex min-h-0 flex-1 flex-row flex-nowrap items-center py-10 min-[768px]:py-12 gap-24 min-[768px]:gap-36 min-[1024px]:gap-48 min-[1280px]:gap-60 min-[1536px]:gap-72 min-[1920px]:gap-[360px] min-[2160px]:gap-[405px] min-[2500px]:gap-[469px] min-[3000px]:gap-[563px] min-[3400px]:gap-[638px] min-[3800px]:gap-[713px] min-[4200px]:gap-[788px] min-[4600px]:gap-[863px] min-[5060px]:gap-[949px] z-1">
        {items.map((slide, index) => (
          <AboutGallerySlide key={`${slide.image}-${index}`} {...slide} />
        ))}
      </div>
    </section>
  );
}