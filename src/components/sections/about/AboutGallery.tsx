import { Fragment } from "react";
import type { MotionValue } from "framer-motion";

import { aboutData } from "../../../data/about";
import { buildAboutGalleryHalls } from "../../../lib/buildAboutGalleryHalls";

import { AboutGallerySeparator } from "./AboutGallerySeparator";
import { AboutGalleryWall } from "./AboutGalleryWall";

type AboutGalleryProps = {
  scrollYProgress: MotionValue<number>;
  totalScrollWidth: number;
};

export function AboutGallery({ scrollYProgress, totalScrollWidth }: AboutGalleryProps) {
  const halls = buildAboutGalleryHalls(aboutData.timeline, aboutData.timelineSeparators);

  if (halls.length === 0) return null;

  return (
    <div className="flex h-dvh min-h-full w-max max-w-none flex-row flex-nowrap overflow-y-hidden [scrollbar-gutter:stable]">
      {halls.map((hall) => (
        <Fragment key={hall.yearId}>
          <AboutGallerySeparator src={hall.separator.src} alt={hall.separator.alt} />
          <AboutGalleryWall
            year={hall.year}
            yearId={hall.yearId}
            backgroundClassName={hall.backgroundClassName}
            items={[...hall.slides]}
            scrollYProgress={scrollYProgress}
            totalScrollWidth={totalScrollWidth}
          />
        </Fragment>
      ))}
    </div>
  );
}