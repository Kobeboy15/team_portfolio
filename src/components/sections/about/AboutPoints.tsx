import { aboutData } from "../../../data/about";
import { ScrollReveal } from "../../ui/ScrollReveal";

export function AboutPoints() {
  return (
    <div className="flex min-h-0 w-full items-center justify-center bg-background py-16 sm:w-max sm:min-h-[calc(100dvh-72px)] sm:py-0">
      <div className="flex w-full flex-col items-start justify-center gap-8 sm:flex-row sm:gap-0 lg:h-[calc(100dvh-72px)] lg:w-[min(100vw,2500px)] lg:flex-col">
        {aboutData.points.map((point, index) => (
          <div key={index} className="w-full">
            <div className="mx-5 flex max-w-full flex-col px-7 py-2 font-sora sm:max-w-[100vw] sm:px-12 sm:py-6 lg:mx-0 lg:flex-row lg:gap-10 lg:px-[10vw] 2xl:text-sora-18">
              <ScrollReveal>
                <h3 className="min-w-48 lg:mb-5">{point.title}</h3>
              </ScrollReveal>
              <hr className="mt-1 mb-2 mr-12 h-px border-none bg-border lg:hidden" />
              <ScrollReveal delay={0.1}>
                <p>{point.description}</p>
              </ScrollReveal>
            </div>
            {index < aboutData.points.length - 1 ? (
              <hr className="hidden border-none bg-border lg:mx-12 lg:block lg:h-px" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
