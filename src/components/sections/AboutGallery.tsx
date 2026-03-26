import { ImageFrame } from "../ui/ImageFrame";
import { AboutGallerySlide, type AboutSlide } from "./AboutGallerySlide";

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

type GallerySeparatorProps = {
  src: string;
  alt: string;
  priority: boolean;
};

function GallerySeparator({ src, alt, priority }: GallerySeparatorProps) {
  return (
    <section
      className="relative h-dvh w-[min(70vw,50rem)] shrink-0 overflow-hidden"
      aria-label={alt}
    >
      <div className="relative h-full w-full overflow-hidden">
        <ImageFrame
          placement="about-gallery-hero"
          src={src}
          alt={alt}
          sizes="min(70vw, 50rem)"
          priority={priority}
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
        "flex relative h-dvh w-max min-h-0 shrink-0 flex-row items-center text-foreground",
        "pl-6 pr-16 gap-16",
        backgroundClassName,
      )}
      aria-labelledby={yearId}
    >
      {/* Space for the year (absolute position) */}
      <div className="block w-[305px]"></div>
      <h2
        id={yearId}
        className={cn(
          "absolute bottom-0 pb-6 shrink-0 font-bebas uppercase text-years leading-(--text-years--line-height) tracking-years",
        )}
      >
        {year}
      </h2>

      <div className="flex min-h-0 flex-1 flex-row flex-nowrap items-center gap-24 py-10 md:gap-12 md:py-12">
        {items.map((slide, index) => (
          <AboutGallerySlide key={`${slide.image}-${index}`} {...slide} />
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
      src: `${TIMELINE_BASE}/IMG_0629.webp`,
      alt: "Full-width photograph separating gallery sections",
    },
    {
      src: `${TIMELINE_BASE}/IMG_0637.webp`,
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
          image: `${TIMELINE_BASE}/IMG_0610.webp`,
          imageAlt: "Gallery photograph",
          title: "Opening wall",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
          year: "2023",
        },
        {
          image: `${TIMELINE_BASE}/IMG_0616.webp`,
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
          image: `${TIMELINE_BASE}/IMG_0620.webp`,
          imageAlt: "Gallery photograph",
          title: "Spring corridor",
          description:
            "Placeholder copy for a slide without a prior caption; replace when content is ready.",
          year: "2024",
        },
        {
          image: `${TIMELINE_BASE}/IMG_0608.webp`,
          imageAlt: "Gallery photograph",
          title: "Studio notes",
          description:
            "Auctor augue mauris augue neque gravida in fermentum et sollicitudin.",
          year: "2024",
        },
        {
          image: `${TIMELINE_BASE}/IMG_0625.webp`,
          imageAlt: "Gallery photograph",
          title: "City rhythm",
          description:
            "Placeholder copy for a slide without a prior caption; replace when content is ready.",
          year: "2024",
        },
        {
          image: `${TIMELINE_BASE}/IMG_0586.webp`,
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
    <div className="flex h-dvh min-h-dvh w-full max-w-none flex-row flex-nowrap overflow-x-auto overflow-y-hidden [scrollbar-gutter:stable]">
      <GallerySeparator src={sepA.src} alt={sepA.alt} priority={true} />
      <GalleryWall
        year={wallA.year}
        yearId={wallA.yearId}
        backgroundClassName={wallA.backgroundClassName}
        items={[...wallA.items]}
      />
      <GallerySeparator src={sepB.src} alt={sepB.alt} priority={false} />
      <GalleryWall
        year={wallB.year}
        yearId={wallB.yearId}
        backgroundClassName={wallB.backgroundClassName}
        items={[...wallB.items]}
      />
    </div>
  );
}
