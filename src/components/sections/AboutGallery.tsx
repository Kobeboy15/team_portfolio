import { ImageFrame } from "../ui/ImageFrame";
import {
  AboutGallerySlide,
  type AboutSlide,
} from "./AboutGallerySlide";

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

type GallerySeparatorProps = {
  src: string;
  alt: string;
};

function GallerySeparator({ src, alt }: GallerySeparatorProps) {
  return (
    <section
      className="relative h-dvh w-[70vw] shrink-0 overflow-hidden"
      aria-label={alt}
    >
      <div className="relative h-full w-full overflow-hidden">
        <ImageFrame
          placement="about-gallery-hero"
          src={src}
          alt={alt}
        />
      </div>
    </section>
  );
}

type GalleryWallProps = {
  year: string;
  yearId: string;
  backgroundClassName: string;
  items: AboutSlide[];
};

function GalleryWall({
  year,
  yearId,
  backgroundClassName,
  items,
}: GalleryWallProps) {
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
        className={cn(
          "absolute bottom-0 pb-6 shrink-0 font-bebas uppercase text-years leading-(--text-years--line-height) tracking-years",
        )}
      >
        {year}
      </h2>
      
      <div className="flex min-h-0 flex-1 flex-row flex-nowrap items-center py-10 min-[768px]:py-12 gap-24 min-[768px]:gap-36 min-[1024px]:gap-48 min-[1280px]:gap-60 min-[1536px]:gap-72 min-[1920px]:gap-[360px] min-[2160px]:gap-[405px] min-[2500px]:gap-[469px] min-[3000px]:gap-[563px] min-[3400px]:gap-[638px] min-[3800px]:gap-[713px] min-[4200px]:gap-[788px] min-[4600px]:gap-[863px] min-[5060px]:gap-[949px]">
        {items.map((slide, index) => (
          <AboutGallerySlide
            key={`${slide.image}-${index}`}
            {...slide}
          />
        ))}
      </div>
    </section>
  );
}

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
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
          year: "2023",
        },
        {
          image: `${TIMELINE_BASE}/timeline-2023-02.webp`,
          imageAlt: "Gallery photograph",
          title: "Evening walk",
          description:
            "Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.",
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
          description:
            "Placeholder copy for a slide without a prior caption; replace when content is ready.",
          year: "2024",
        },
        {
          image: `${TIMELINE_BASE}/timeline-2024-02.webp`,
          imageAlt: "Gallery photograph",
          title: "Studio notes",
          description:
            "Auctor augue mauris augue neque gravida in fermentum et sollicitudin.",
          year: "2024",
        },
        {
          image: `${TIMELINE_BASE}/timeline-2024-03.webp`,
          imageAlt: "Gallery photograph",
          title: "City rhythm",
          description:
            "Placeholder copy for a slide without a prior caption; replace when content is ready.",
          year: "2024",
        },
        {
          image: `${TIMELINE_BASE}/timeline-2024-04.webp`,
          imageAlt: "Gallery photograph",
          title: "Late train",
          description:
            "Placeholder copy for a slide without a prior caption; replace when content is ready.",
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
    <div
      className="flex h-dvh pb-17 min-h-full w-max max-w-none flex-row flex-nowrap overflow-y-hidden [scrollbar-gutter:stable]"
    >
      <GallerySeparator src={sepA.src} alt={sepA.alt} />
      <GalleryWall
        year={wallA.year}
        yearId={wallA.yearId}
        backgroundClassName={wallA.backgroundClassName}
        items={[...wallA.items]}
      />
      <GallerySeparator src={sepB.src} alt={sepB.alt} />
      <GalleryWall
        year={wallB.year}
        yearId={wallB.yearId}
        backgroundClassName={wallB.backgroundClassName}
        items={[...wallB.items]}
      />
    </div>
  );
}
