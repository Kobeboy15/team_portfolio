import { ImageFrame } from "../ui/ImageFrame";

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export type AboutSlide = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  year?: string;
};

export type AboutGallerySlideProps = AboutSlide & {
  className?: string;
};

export function AboutGallerySlide({
  title,
  description,
  image,
  imageAlt,
  year,
  className,
}: AboutGallerySlideProps) {
  return (
    <article
      className={cn(
        "flex max-w-lg flex-col gap-3 sm:flex-row sm:items-start sm:gap-4",
        className,
      )}
    >
      <ImageFrame
        placement="timeline"
        src={image}
        alt={imageAlt}
        className="h-auto w-full max-w-[min(100%,28rem)] shrink-0 shadow-md sm:w-auto"
      />
      <div className="flex max-w-xs flex-col gap-2 sm:max-w-56 sm:pt-1">
        <h3 className="font-bebas text-xl uppercase tracking-wide text-foreground">
          {title}
        </h3>
        <p className="text-sora-13 font-light leading-relaxed">{description}</p>
        {year ? (
          <p className="text-sora-13 font-light leading-relaxed text-foreground-secondary">
            {year}
          </p>
        ) : null}
      </div>
    </article>
  );
}
