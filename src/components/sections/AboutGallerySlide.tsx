import type { AboutSlide } from "../../types/about";

import { ImageFrame } from "../ui/ImageFrame";

const TOP_SPACER_MIN_PX = 12;
const TOP_SPACER_MAX_PX = 110;

function hashImage(image: string): number {
  let h = 0;

  for (let i = 0; i < image.length; i++) {
    h = (Math.imul(31, h) + image.charCodeAt(i)) | 0;
  }
  return h;
}

function hashImageToTopSpacerPx(image: string): number {
  const h = hashImage(image);
  const span = TOP_SPACER_MAX_PX - TOP_SPACER_MIN_PX + 1;

  return TOP_SPACER_MIN_PX + (Math.abs(h) % span);
}

type ArticleAlign = "stretch" | "end";

function hashImageToArticleAlign(image: string): ArticleAlign {
  const r = Math.abs(hashImage(image)) % 2;
  if (r === 0) {
    return "stretch";
  }

  return "end";
}

const ARTICLE_ALIGN_CLASS: Record<ArticleAlign, string> = {
  stretch: "sm:items-stretch",
  end: "sm:items-end",
};

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export type AboutGallerySlideProps = AboutSlide & {
  className?: string;
};

export function AboutGallerySlide({ title, description, image, imageAlt, className }: AboutGallerySlideProps) {
  const topSpacerPx = hashImageToTopSpacerPx(image);
  const articleAlign = hashImageToArticleAlign(image);
  const spacerOnBottom = articleAlign === "end";

  const copyBlock = (
    <div className="flex shrink-0 flex-col gap-2">
      <h3 className="font-bebas text-xl uppercase tracking-wide text-foreground">{title}</h3>

      <p className="text-sora-14 font-light leading-relaxed">{description}</p>
    </div>
  );

  return (
    <article className={cn("flex flex-col gap-3 sm:flex-row items-center sm:gap-4 max-w-[90vw]", ARTICLE_ALIGN_CLASS[articleAlign], className)}>
      <ImageFrame
        placement="timeline"
        src={image}
        alt={imageAlt}
        className="w-auto h-full max-h-[60vh] sm:max-h-[70vh] sm:max-w-[60vw] sm:self-start shrink-0 shadow-xl"
      />

      <div className="flex w-full shrink-0 flex-col gap-2 sm:h-full sm:min-h-0 sm:w-[180px] sm:gap-0">
        {spacerOnBottom ? (
          <>
            <div aria-hidden className="hidden min-h-0 shrink-0 sm:block sm:flex-1" />
            {copyBlock}
            <div aria-hidden className="hidden shrink-0 sm:block" style={{ height: topSpacerPx }} />
          </>
        ) : (
          <>
            <div aria-hidden className="hidden shrink-0 sm:block" style={{ height: topSpacerPx }} />
            {copyBlock}
            <div aria-hidden className="hidden min-h-4 shrink-0 sm:block sm:flex-1" />
          </>
        )}
      </div>
    </article>
  );
}
