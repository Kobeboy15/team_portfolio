import { VARIANTS } from "./BentoGrid";

export function CardDecor({ slot }: { slot: keyof typeof VARIANTS }) {
  switch (slot) {
    case "card2":
    case "card5":
        return <div className="w-full h-full flex justify-center items-center"><img src={"images/skills/skills-decor-circle.webp"} className="w-full h-auto md:h-full md:w-auto p-1"></img></div>;
    case "card1":
    case "card4":
    case "card6":
        return <div className="font-bebas text-[0.9rem] md:text-display-36 bg-(--token-background-2) text-(--token-accent) w-full h-full flex justify-center items-center">코비 마이클</div>;
    case "card7":
    case "card3":
        return (
            <div className="w-full h-full relative">
                <img src={"images/skills/skills-decor-flower-left.webp"} className="absolute top-0 left-0 h-[70%] w-auto md:w-[40%] md:h-auto"></img>
                <img src={"images/skills/skills-decor-flower-right.webp"} className="absolute bottom-0 right-0 h-[70%] w-auto md:w-[40%] md:h-auto"></img>
            </div>
        );
  }
}