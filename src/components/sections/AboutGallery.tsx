import { ImageFrame } from "../ui/ImageFrame";

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
      className="w-full"
      aria-label={alt}
    >
      <div className="relative min-h-dvh w-full overflow-hidden">
        <ImageFrame
          placement="about-gallery-hero"
          src={src}
          alt={alt}
        />
      </div>
    </section>
  );
}

export type GalleryWallItem = {
  src: string;
  alt: string;
  caption?: string;
};

type GalleryWallProps = {
  label: string;
  labelId: string;
  backgroundClassName: string;
  items: GalleryWallItem[];
};

function GalleryWall({
  label,
  labelId,
  backgroundClassName,
  items,
}: GalleryWallProps) {
  return (
    <section
      className={cn(
        "flex min-h-dvh w-full flex-col text-foreground",
        "px-6 md:px-12",
        backgroundClassName,
      )}
      aria-labelledby={labelId}
    >
      <div className="flex flex-1 flex-col gap-10 py-10 md:gap-12 md:py-12 items-center">
        {items.map((item, index) => (
          <article
            key={`${item.src}-${index}`}
            className="flex max-w-lg flex-col gap-3"
          >
            <ImageFrame
              placement="timeline"
              src={item.src}
              alt={item.alt}
              className="h-auto w-full shadow-md"
            />
            {item.caption ? (
              <p className="text-sora-13 font-light leading-relaxed">
                {item.caption}
              </p>
            ) : null}
          </article>
        ))}
      </div>
      <h2
        id={labelId}
        className={cn(
          "shrink-0 pb-8 font-bebas uppercase text-years leading-(--text-years--line-height) tracking-years md:pb-12",
        )}
      >
        {label}
      </h2>
    </section>
  );
}

const TIMELINE_BASE = "/images/about/timeline";

/** Temporary hardcoded gallery content; replace with data from `about` when ready. */
const galleryTestData = {
  separators: [
    {
      src: `${TIMELINE_BASE}/timeline-2023-02.webp`,
      alt: "Full-width photograph separating gallery sections",
    },
    {
      src: `${TIMELINE_BASE}/timeline-2024-02.webp`,
      alt: "Full-width photograph separating gallery sections",
    },
  ],
  walls: [
    {
      label: "First hall",
      labelId: "about-gallery-wall-first-hall",
      backgroundClassName: "bg-background-2",
      items: [
        {
          src: `${TIMELINE_BASE}/timeline-2023-01.webp`,
          alt: "Gallery photograph",
          caption:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
        },
        {
          src: `${TIMELINE_BASE}/timeline-2023-03.webp`,
          alt: "Gallery photograph",
        },
        {
          src: `${TIMELINE_BASE}/IMG_0569.webp`,
          alt: "Gallery photograph",
          caption:
            "Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.",
        },
      ] satisfies GalleryWallItem[],
    },
    {
      label: "Second hall",
      labelId: "about-gallery-wall-second-hall",
      backgroundClassName: "bg-background",
      items: [
        {
          src: `${TIMELINE_BASE}/timeline-2024-01.webp`,
          alt: "Gallery photograph",
        },
        {
          src: `${TIMELINE_BASE}/timeline-2024-03.webp`,
          alt: "Gallery photograph",
          caption:
            "Auctor augue mauris augue neque gravida in fermentum et sollicitudin.",
        },
        {
          src: `${TIMELINE_BASE}/IMG_0610.webp`,
          alt: "Gallery photograph",
        },
        {
          src: `${TIMELINE_BASE}/IMG_0586.webp`,
          alt: "Gallery photograph",
        },
      ] satisfies GalleryWallItem[],
    },
  ],
} as const;

export function AboutGallery() {
  const [sepA, sepB] = galleryTestData.separators;
  const [wallA, wallB] = galleryTestData.walls;

  return (
    <div className="flex w-full flex-col">
      <GallerySeparator src={sepA.src} alt={sepA.alt} />
      <GalleryWall
        label={wallA.label}
        labelId={wallA.labelId}
        backgroundClassName={wallA.backgroundClassName}
        items={[...wallA.items]}
      />
      <GallerySeparator src={sepB.src} alt={sepB.alt} />
      <GalleryWall
        label={wallB.label}
        labelId={wallB.labelId}
        backgroundClassName={wallB.backgroundClassName}
        items={[...wallB.items]}
      />
    </div>
  );
}
