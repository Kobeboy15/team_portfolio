"use client";

import { ImageFrame } from "../../ui/ImageFrame";

export type AboutBioProfileImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
};

/** Static profile frame (scroll flight is handled by HeroAboutImageCoordinator on lg+). */
export function AboutBioProfileImage({
  src,
  alt,
  sizes,
  className,
}: AboutBioProfileImageProps) {
  return (
    <ImageFrame
      placement="about"
      src={src}
      alt={alt}
      sizes={sizes}
      className={className}
    />
  );
}
