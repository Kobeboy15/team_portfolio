import { aboutData } from "../../data/about";

export function AboutPoints() {
  return (
        <div className="min-h-screen w-max md:w-screen md:h-screen flex md:flex-col items-center bg-(--token-background)">
            {
                /**
             * Renders a list of about points with a title and description,
             * separated by horizontal dividers between each item.
             */
            aboutData.points.map((point, index) => (
                <div key={index}>
                    <div className="flex flex-col max-w-screen md:flex-row px-12 py-6 mx-5 md:mx-0">
                        <h3 className="min-w-48 md:mb-5">{point.title}</h3>
                        <hr className="md:hidden border-none h-px bg-(--token-border) mx-12 mb:5"/>
                        <p>{point.description}</p>
                    </div>
                    {index < aboutData.points.length - 1 && <hr className="hidden md:block border-none h-px bg-(--token-border) mx-12"/>}
                </div>
            ))
            }
        </div>
  );
}