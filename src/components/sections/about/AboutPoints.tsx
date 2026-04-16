import { aboutData } from "../../../data/about";
import { ScrollReveal } from "../../ui/ScrollReveal";

export function AboutPoints() {
  return (
    <div className="flex min-h-0 w-full items-center justify-center bg-background sm:w-max sm:min-h-[calc(100dvh-72px)]">
      <div className="flex w-full flex-col items-start justify-center sm:flex-row lg:h-[calc(100dvh-72px)] lg:w-[min(100vw,2500px)] lg:flex-col">
        {aboutData.points.map((point, index) => (
          <div key={index} className="w-full">
            <div className="mx-5 flex max-w-full flex-col px-7 py-6 font-sora sm:max-w-[100vw] sm:px-12 lg:mx-0 lg:flex-row lg:gap-10 lg:px-[10vw] 2xl:text-sora-18">
              <ScrollReveal>
                <h3 className="min-w-48 lg:mb-5">{point.title}</h3>
              </ScrollReveal>
              <hr className="mt-1 mb-2 mr-12 h-px border-none bg-border lg:hidden" />
              <ScrollReveal delay={0.1}>
                <p>{point.description}</p>
              </ScrollReveal>
            </div>
            {index < aboutData.points.length - 1 ? (
              <hr className="mx-5 h-px border-none bg-border sm:hidden lg:mx-12 lg:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
