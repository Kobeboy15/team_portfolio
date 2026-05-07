"use client";

import { useCallback, useRef } from "react";

import { ImageFrame } from "../../ui/ImageFrame";

export type AboutBioProfileImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  onReady?: () => void;
};

/** Static profile frame (scroll flight is handled by HeroAboutImageCoordinator on lg+). */
export function AboutBioProfileImage({
  src,
  alt,
  sizes,
  className,
  onReady,
}: AboutBioProfileImageProps) {
  const hasReportedReady = useRef(false);

  const reportReady = useCallback(() => {
    if (hasReportedReady.current) return;
    hasReportedReady.current = true;
    onReady?.();
  }, [onReady]);

  const setImageRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0) {
        reportReady();
      }
    },
    [reportReady],
  );

  return (
    <ImageFrame
      placement="about"
      src={src}
      alt={alt}
      sizes={sizes}
      imageRef={setImageRef}
      onLoad={reportReady}
      className={className}
    />
  );
}
