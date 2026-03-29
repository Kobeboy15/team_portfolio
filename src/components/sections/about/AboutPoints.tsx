import { aboutData } from "../../../data/about";

export function AboutPoints() {
  return (
        <div className="min-h-[calc(100dvh-72px)] w-max lg:w-[min(100vw,2500px)]  lg:h-[calc(100dvh-72px)] flex lg:flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-start justify-center">
            {
                /**
             * Renders a list of about points with a title and description,
             * separated by horizontal dividers between each item.
             */
            aboutData.points.map((point, index) => (
                <div key={index}>
                    <div className="flex flex-col max-w-[min(100vw,2000px)] lg:flex-row px-12 py-6 mx-5 lg:mx-0">
                        <h3 className="min-w-48 lg:mb-5">{point.title}</h3>
                        <hr className="lg:hidden border-none h-px bg-border mr-12 mt-1 mb-2"/>
                        <p>{point.description}</p>
                    </div>
                    {index < aboutData.points.length - 1 && <hr className="hidden lg:block border-none h-px bg-border mx-12"/>}
                </div>
            ))
            }
            </div>
        </div>
  );
}
