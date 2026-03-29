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
};

export function AboutGalleryWall({ year, yearId, backgroundClassName, items }: AboutGalleryWallProps) {
  return (
    <section
      className={cn(
        "flex relative h-full w-max min-h-0 shrink-0 flex-row items-center text-foreground",
        "pl-6 md:pl-12 2xl:pl-20 pr-16 md:pr-28 lg:pr-44 2xl:pr-72 gap-16",
        backgroundClassName,
      )}
      aria-labelledby={yearId}
    >
      {/* Space for the year (absolute position) */}
      <div className="block w-[305px] lg:w-[330px]"></div>
      <h2
        id={yearId}
        className={cn("absolute left-20 bottom-6 shrink-0 font-bebas uppercase text-years leading-(--text-years--line-height) tracking-years")}
      >
        {year}
      </h2>

      <div className="flex min-h-0 flex-1 flex-row flex-nowrap items-center py-10 min-[768px]:py-12 gap-24 min-[768px]:gap-36 min-[1024px]:gap-48 min-[1280px]:gap-60 min-[1536px]:gap-72 min-[1920px]:gap-[360px] min-[2160px]:gap-[405px] min-[2500px]:gap-[469px] min-[3000px]:gap-[563px] min-[3400px]:gap-[638px] min-[3800px]:gap-[713px] min-[4200px]:gap-[788px] min-[4600px]:gap-[863px] min-[5060px]:gap-[949px]">
        {items.map((slide, index) => (
          <AboutGallerySlide key={`${slide.image}-${index}`} {...slide} />
        ))}
      </div>
    </section>
  );
}
