import { Fragment } from "react";
import type { MotionValue } from "framer-motion";

import { aboutData } from "../../../data/about";
import { buildAboutGalleryHalls } from "../../../lib/buildAboutGalleryHalls";

import { AboutGallerySeparator } from "./AboutGallerySeparator";
import { AboutGalleryWall } from "./AboutGalleryWall";

type AboutGalleryOrientation = "horizontal" | "vertical";

type AboutGalleryProps = {
  idNamespace: string;
  scrollYProgress?: MotionValue<number>;
  totalScrollWidth?: number;
  orientation?: AboutGalleryOrientation;
  useStableMobileMediaHeight?: boolean;
};

export function AboutGallery({
  idNamespace,
  scrollYProgress,
  totalScrollWidth = 0,
  orientation = "horizontal",
  useStableMobileMediaHeight = false,
}: AboutGalleryProps) {
  const halls = buildAboutGalleryHalls(aboutData.timeline, aboutData.timelineSeparators);

  if (halls.length === 0) return null;

  return (
    <div
      className={
        orientation === "vertical"
          ? "flex w-full max-w-none flex-col overflow-x-hidden"
          : "flex h-dvh min-h-full w-max max-w-none flex-row flex-nowrap overflow-y-hidden [scrollbar-gutter:stable]"
      }
    >
      {halls.map((hall) => (
        <Fragment key={`${hall.yearId}-${idNamespace}`}>
          <AboutGallerySeparator
            src={hall.separator.src}
            alt={hall.separator.alt}
            orientation={orientation}
            useStableMobileMediaHeight={useStableMobileMediaHeight}
          />
          <AboutGalleryWall
            idNamespace={idNamespace}
            year={hall.year}
            yearId={hall.yearId}
            backgroundClassName={hall.backgroundClassName}
            items={[...hall.slides]}
            scrollYProgress={scrollYProgress}
            totalScrollWidth={totalScrollWidth}
            orientation={orientation}
            useStableMobileMediaHeight={useStableMobileMediaHeight}
          />
        </Fragment>
      ))}
    </div>
  );
}
