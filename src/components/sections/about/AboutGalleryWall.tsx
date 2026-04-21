import { useRef, useLayoutEffect, useState, useMemo } from "react";
import { useTransform, motion, MotionValue } from "framer-motion";
import type { AboutSlide } from "../../../types/about";
import { AboutGallerySlide } from "./AboutGallerySlide";

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

type AboutGalleryWallProps = {
  idNamespace: string;
  year: string;
  yearId: string;
  backgroundClassName: string;
  items: AboutSlide[];
  scrollYProgress?: MotionValue<number>;
  totalScrollWidth: number;
  orientation?: "horizontal" | "vertical";
  useStableMobileMediaHeight?: boolean;
};

type DesktopAboutGalleryWallProps = Omit<AboutGalleryWallProps, "scrollYProgress" | "orientation"> & {
  scrollYProgress: MotionValue<number>;
};

function DesktopAboutGalleryWall({
  idNamespace,
  year,
  yearId,
  backgroundClassName,
  items,
  scrollYProgress,
  totalScrollWidth,
}: DesktopAboutGalleryWallProps) {
  const wallRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLHeadingElement>(null);

  const [wallData, setWallData] = useState({ offsetLeft: 0, width: 0 });
  const [yearWidth, setYearWidth] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (yearRef.current) setYearWidth(yearRef.current.offsetWidth);
      if (wallRef.current) {
        setWallData({
          offsetLeft: wallRef.current.offsetLeft,
          width: wallRef.current.offsetWidth,
        });
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    const scrollContainer = wallRef.current?.closest<HTMLElement>("[data-scroll-container]");
    if (scrollContainer) ro.observe(scrollContainer);
    if (yearRef.current) ro.observe(yearRef.current);
    if (wallRef.current) ro.observe(wallRef.current);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { enter, exit, clampedWidth } = useMemo(() => {
    const { offsetLeft, width } = wallData;

    const availableTravel = Math.max(0, width - yearWidth - 100);
    const remainingTrack = Math.max(0, totalScrollWidth - offsetLeft);
    const resolvedClampedWidth = Math.min(availableTravel, remainingTrack);

    const rawEnter = totalScrollWidth > 0 ? offsetLeft / totalScrollWidth : 0;
    const rawExit = totalScrollWidth > 0 ? (offsetLeft + resolvedClampedWidth) / totalScrollWidth : 1;
    const resolvedEnter = Math.min(1, Math.max(0, rawEnter));
    const resolvedExit = Math.min(1, Math.max(resolvedEnter, rawExit));

    return {
      enter: resolvedEnter,
      exit: resolvedExit,
      clampedWidth: resolvedClampedWidth,
    };
  }, [wallData, yearWidth, totalScrollWidth]);

  const yearX = useTransform(
    scrollYProgress,
    [0, enter, exit, 1],
    [0, 0, clampedWidth, clampedWidth]
  );
  const headingId = `${yearId}-${idNamespace}`;

  return (
    <section
      ref={wallRef}
      className={cn(
        "flex relative h-full w-max min-h-0 shrink-0 flex-row items-center text-foreground",
        "pl-6 md:pl-12 2xl:pl-20 pr-16 md:pr-28 lg:pr-44 2xl:pr-72 gap-16",
        backgroundClassName
      )}
      aria-labelledby={headingId}
    >
      <div className="block w-[305px] lg:w-[330px]" />

      <motion.h2
        id={headingId}
        style={{ x: yearX }}
        ref={yearRef}
        className={cn(
          "absolute left-2 md:left-20 bottom-0 md:bottom-6 shrink-0 font-bebas uppercase z-0",
          "text-display-96 md:text-years leading-(--text-years--line-height) tracking-years"
        )}
      >
        {year}
      </motion.h2>

      <div className="flex min-h-0 flex-1 flex-row flex-nowrap items-center py-10 min-[768px]:py-12 gap-24 min-[768px]:gap-36 min-[1024px]:gap-48 min-[1280px]:gap-60 min-[1536px]:gap-72 min-[1920px]:gap-[360px] min-[2160px]:gap-[405px] min-[2500px]:gap-[469px] min-[3000px]:gap-[563px] min-[3400px]:gap-[638px] min-[3800px]:gap-[713px] min-[4200px]:gap-[788px] min-[4600px]:gap-[863px] min-[5060px]:gap-[949px] z-1">
        {items.map((slide, index) => (
          <AboutGallerySlide key={`${slide.image}-${index}`} {...slide} orientation="horizontal" />
        ))}
      </div>
    </section>
  );
}

function MobileAboutGalleryWall({
  idNamespace,
  year,
  yearId,
  backgroundClassName,
  items,
  useStableMobileMediaHeight = false,
}: AboutGalleryWallProps) {
  const headingId = `${yearId}-${idNamespace}`;

  return (
    <section
      className={cn("relative w-full py-6 text-foreground", backgroundClassName)}
      aria-labelledby={headingId}
    >
      <div className={cn("px-5 py-4", backgroundClassName)}>
        <h2
          id={headingId}
          className="font-bebas text-display-96 leading-(--text-years--line-height) tracking-years uppercase"
        >
          {year}
        </h2>
      </div>

      <div className="flex w-full flex-col gap-8 pb-8 pt-2">
        {items.map((slide, index) => (
          <AboutGallerySlide
            key={`${slide.image}-${index}`}
            {...slide}
            orientation="vertical"
            useStableMobileMediaHeight={useStableMobileMediaHeight}
          />
        ))}
      </div>
    </section>
  );
}

export function AboutGalleryWall(props: AboutGalleryWallProps) {
  if (props.orientation === "vertical") {
    return <MobileAboutGalleryWall {...props} />;
  }

  if (!props.scrollYProgress) {
    return null;
  }

  return <DesktopAboutGalleryWall {...props} scrollYProgress={props.scrollYProgress} />;
}
