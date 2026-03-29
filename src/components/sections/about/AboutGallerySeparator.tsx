import { ImageFrame } from "../../ui/ImageFrame";

type AboutGallerySeparatorProps = {
  src: string;
  alt: string;
};

export function AboutGallerySeparator({ src, alt }: AboutGallerySeparatorProps) {
  return (
    <section className="relative h-dvh w-[70vw] shrink-0 overflow-hidden" aria-label={alt}>
      <div className="relative h-full w-full overflow-hidden">
        <ImageFrame placement="about-gallery-hero" src={src} alt={alt} />
      </div>
    </section>
  );
}
