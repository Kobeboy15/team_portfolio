import { desktopGridVariants } from "@/src/data/skills";
import { CardSlot } from "@/src/types/skills";

// TODO: This is a temporary component to add decor to the bento grid. It should be replaced with a more flexible solution in the future, such as allowing the BentoItem to specify a decor component or style.
// for a later ticket, ignore for now
export function CardDecor({ slot }: { slot: CardSlot }) {
  switch (slot) {
    case "2":
    case "5":
        return <div className="w-full h-full flex justify-center items-center"><img src={"images/skills/skills-decor-circle.webp"} className="w-full h-auto md:h-full md:w-auto p-1"></img></div>;
    case "1":
    case "4":
    case "6":
        return <div className="font-bebas bg-(--token-background-2) text-(--token-accent) w-full h-full flex justify-center items-center text-lg md:text-4xl">코비 마이클</div>;
    case "7":
    case "3":
        return (
            <div className="w-full h-full relative">
                <img src={"images/skills/skills-decor-flower-left.webp"} className="absolute top-0 left-0 h-[70%] w-auto md:w-[40%] md:h-auto"></img>
                <img src={"images/skills/skills-decor-flower-right.webp"} className="absolute bottom-0 right-0 h-[70%] w-auto md:w-[40%] md:h-auto"></img>
            </div>
        );
  }
}