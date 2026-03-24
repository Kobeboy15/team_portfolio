import { ImageFrame } from "../ui/ImageFrame";

const TOP_SPACER_MIN_PX = 12;
const TOP_SPACER_MAX_PX = 56;

function hashImageToTopSpacerPx(image: string): number {
  let h = 0;

  for (let i = 0; i < image.length; i++) {
    h = (Math.imul(31, h) + image.charCodeAt(i)) | 0;
  }

  const span = TOP_SPACER_MAX_PX - TOP_SPACER_MIN_PX + 1;

  return TOP_SPACER_MIN_PX + (Math.abs(h) % span);
}

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

export function AboutGallerySlide({ title, description, image, imageAlt, year, className }: AboutGallerySlideProps) {
  const topSpacerPx = hashImageToTopSpacerPx(image);

  return (
    <article
      className={cn(
        "flex flex-col gap-3 sm:flex-row items-center sm:items-stretch sm:gap-4 max-w-[90vw]",
        className,
      )}
    >
      <ImageFrame placement="timeline" src={image} alt={imageAlt} className="h-full max-h-[60vh] w-auto sm:h-auto sm:w-auto sm:max-h-[70vh] shrink-0 shadow-md " />

      <div className="flex w-full shrink-0 flex-col gap-2 sm:h-full sm:min-h-0 sm:w-[180px] sm:gap-0">
        <div aria-hidden className="hidden shrink-0 sm:block" style={{ height: topSpacerPx }} />

        <div className="flex shrink-0 flex-col gap-2">
          <h3 className="font-bebas text-xl uppercase tracking-wide text-foreground">{title}</h3>

          <p className="text-sora-13 font-light leading-relaxed">{description}</p>

          {year ? <p className="text-sora-13 font-light leading-relaxed text-foreground-secondary">{year}</p> : null}
        </div>

        <div aria-hidden className="hidden min-h-4 shrink-0 sm:block sm:flex-1" />
      </div>
    </article>
  );
}
