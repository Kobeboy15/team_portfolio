import React from "react";
import Image, { ImageProps } from "next/image";

/**
 * Placement presets from Figma (display size). Export assets at 2x for retina.
 * Use WebP for photos; SVG for icons/illustrations.
 */
export type ImageFramePlacement =
  | "hero" // 773×580
  | "about" // 594×640
  | "about-points" // 594×700
  | "about-separator" // 996×700
  | "about-gallery-hero" // full-viewport parent + fill + object-cover (width/height ignored)
  | "timeline" // various — override with width/height/sizes
  | "projects"; // 443×591

const placementConfig: Record<
  Exclude<ImageFramePlacement, "about-gallery-hero">,
  { width: number; height: number; sizes: string }
> = {
  hero: {
    width: 773,
    height: 580,
    sizes: "(min-width: 1536px) min(100vw, 2400px), (min-width: 768px) 773px, 100vw",
  },
  about: {
    width: 594,
    height: 640,
    sizes: "(min-width: 768px) 594px, 100vw",
  },
  "about-points": {
    width: 594,
    height: 700,
    sizes: "(min-width: 768px) 594px, 100vw",
  },
  "about-separator": {
    width: 996,
    height: 700,
    sizes: "(min-width: 1024px) 996px, 100vw",
  },
  timeline: {
    width: 600,
    height: 400,
    sizes: "(min-width: 768px) 600px, 100vw",
  },
  projects: {
    width: 443,
    height: 591,
    sizes: "(min-width: 768px) 443px, 100vw",
  },
};

export type ImageFrameProps = Omit<
  ImageProps,
  "width" | "height" | "sizes" | "priority"
> & {
  /** Preset from Figma; determines display size and responsive sizes. */
  placement: ImageFramePlacement;
  /** Override placement width (e.g. for timeline "various"). Ignored for about-gallery-hero. */
  width?: number;
  /** Override placement height. Ignored for about-gallery-hero. */
  height?: number;
  /** Override placement sizes. */
  sizes?: string;
  /** Default true for placement="hero". Set for LCP. */
  priority?: boolean;
};

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function ImageFrame({
  placement,
  width: widthOverride,
  height: heightOverride,
  sizes: sizesOverride,
  priority: priorityProp,
  src,
  alt,
  className,
  placeholder,
  blurDataURL,
  ...rest
}: ImageFrameProps) {
  if (placement === "about-gallery-hero") {
    const sizes = sizesOverride ?? "100vw";
    const priority = priorityProp ?? false;
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        className={cn("object-cover h-full w-full", className)}
        {...rest}
      />
    );
  }

  const config = placementConfig[placement];
  const width = widthOverride ?? config.width;
  const height = heightOverride ?? config.height;
  const sizes = sizesOverride ?? config.sizes;
  const priority = priorityProp ?? (placement === "hero");

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      className={cn(className)}
      {...rest}
    />
  );
}
