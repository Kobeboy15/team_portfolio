import { ImageFrame } from "../../ui/ImageFrame";

type AboutGallerySeparatorProps = {
  src: string;
  alt: string;
  orientation?: "horizontal" | "vertical";
  useStableMobileMediaHeight?: boolean;
};

export function AboutGallerySeparator({
  src,
  alt,
  orientation = "horizontal",
  useStableMobileMediaHeight = false,
}: AboutGallerySeparatorProps) {
  const mobileHeightClass = useStableMobileMediaHeight
    ? "relative h-[clamp(320px,70svh,960px)] w-full overflow-hidden"
    : "relative h-[clamp(320px,70dvh,960px)] w-full overflow-hidden";

  return (
    <section
      className={
        orientation === "vertical"
          ? mobileHeightClass
          : "relative h-dvh w-[70vw] shrink-0 overflow-hidden"
      }
      aria-label={alt}
    >
      <div className="relative h-full w-full overflow-hidden">
        <ImageFrame placement="about-gallery-hero" src={src} alt={alt} />
      </div>
    </section>
  );
}
