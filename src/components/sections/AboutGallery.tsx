import { Fragment } from "react";

import { aboutData } from "../../data/about";
import { buildAboutGalleryHalls } from "../../lib/buildAboutGalleryHalls";

import { AboutGallerySeparator } from "./AboutGallerySeparator";
import { AboutGalleryWall } from "./AboutGalleryWall";

export function AboutGallery() {
  const halls = buildAboutGalleryHalls(aboutData.timeline, aboutData.timelineSeparators);

  if (halls.length === 0) {
    return null;
  }

  return (
    <div className="flex h-dvh pb-17 min-h-full w-max max-w-none flex-row flex-nowrap overflow-y-hidden [scrollbar-gutter:stable]">
      {halls.map((hall) => (
        <Fragment key={hall.yearId}>
          <AboutGallerySeparator src={hall.separator.src} alt={hall.separator.alt} />
          <AboutGalleryWall
            year={hall.year}
            yearId={hall.yearId}
            backgroundClassName={hall.backgroundClassName}
            items={[...hall.slides]}
          />
        </Fragment>
      ))}
    </div>
  );
}
