import { AboutGallerySeparator } from "./AboutGallerySeparator";
import { AboutGalleryWall } from "./AboutGalleryWall";
import { AboutGallerySlide, type AboutSlide } from "./AboutGallerySlide";

const TIMELINE_BASE = "/images/about/timeline";

/** Temporary hardcoded gallery content; replace with data from `about` when ready. */
const galleryTestData = {
  separators: [
    {
      src: `${TIMELINE_BASE}/timeline-2023-01.webp`,
      alt: "Full-width photograph separating gallery sections",
    },
    {
      src: `${TIMELINE_BASE}/timeline-2026-02.webp`,
      alt: "Full-width photograph separating gallery sections",
    },
  ],
  walls: [
    {
      year: "2023",
      yearId: "about-gallery-wall-first-hall",
      backgroundClassName: "bg-background-2",
      items: [
        {
          image: `${TIMELINE_BASE}/timeline-2023-03.webp`,
          imageAlt: "Gallery photograph",
          title: "Opening wall",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
          year: "2023",
        },
        {
          image: `${TIMELINE_BASE}/timeline-2023-02.webp`,
          imageAlt: "Gallery photograph",
          title: "Evening walk",
          description: "Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.",
          year: "2023",
        },
      ] satisfies AboutSlide[],
    },
    {
      year: "2024",
      yearId: "about-gallery-wall-second-hall",
      backgroundClassName: "bg-background-2",
      items: [
        {
          image: `${TIMELINE_BASE}/timeline-2024-01.webp`,
          imageAlt: "Gallery photograph",
          title: "Spring corridor",
          description: "Placeholder copy for a slide without a prior caption; replace when content is ready.",
          year: "2024",
        },
        {
          image: `${TIMELINE_BASE}/timeline-2024-02.webp`,
          imageAlt: "Gallery photograph",
          title: "Studio notes",
          description: "Auctor augue mauris augue neque gravida in fermentum et sollicitudin.",
          year: "2024",
        },
        {
          image: `${TIMELINE_BASE}/timeline-2024-03.webp`,
          imageAlt: "Gallery photograph",
          title: "City rhythm",
          description: "Placeholder copy for a slide without a prior caption; replace when content is ready.",
          year: "2024",
        },
        {
          image: `${TIMELINE_BASE}/timeline-2024-04.webp`,
          imageAlt: "Gallery photograph",
          title: "Late train",
          description: "Placeholder copy for a slide without a prior caption; replace when content is ready.",
          year: "2024",
        },
      ] satisfies AboutSlide[],
    },
  ],
};

export function AboutGallery() {
  const [sepA, sepB] = galleryTestData.separators;
  const [wallA, wallB] = galleryTestData.walls;

  return (
    <div className="flex h-dvh pb-17 min-h-full w-max max-w-none flex-row flex-nowrap overflow-y-hidden [scrollbar-gutter:stable]">
      <AboutGallerySeparator src={sepA.src} alt={sepA.alt} />
      <AboutGalleryWall year={wallA.year} yearId={wallA.yearId} backgroundClassName={wallA.backgroundClassName} items={[...wallA.items]} />
      <AboutGallerySeparator src={sepB.src} alt={sepB.alt} />
      <AboutGalleryWall year={wallB.year} yearId={wallB.yearId} backgroundClassName={wallB.backgroundClassName} items={[...wallB.items]} />
    </div>
  );
}
