import { ImageFrame } from "../ui/ImageFrame";

export function ImageFrameTestSection() {
  return (
    <section className="mt-10 flex w-full flex-col gap-6 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-foreground">
        Image Frame Component Testing
      </h2>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-foreground">hero</span>
          <ImageFrame
            placement="hero"
            src="https://picsum.photos/773/580"
            alt="Hero (test)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-foreground">about</span>
          <ImageFrame
            placement="about"
            src="https://picsum.photos/594/640"
            alt="About (test)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-foreground">about-points</span>
          <ImageFrame
            placement="about-points"
            src="https://picsum.photos/594/700"
            alt="About points (test)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-foreground">about-separator</span>
          <ImageFrame
            placement="about-separator"
            src="https://picsum.photos/996/700"
            alt="About separator (test)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-foreground">timeline</span>
          <ImageFrame
            placement="timeline"
            src="https://picsum.photos/600/400"
            alt="Timeline (test)"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm text-foreground">projects</span>
          <ImageFrame
            placement="projects"
            src="https://picsum.photos/443/591"
            alt="Projects (test)"
          />
        </div>
      </div>
    </section>
  );
}
