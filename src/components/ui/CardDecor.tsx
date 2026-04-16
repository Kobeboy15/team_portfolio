import { cardDecorBySlot } from "@/src/data/cardDecor";
import { CardSlot } from "@/src/types/skills";

export function CardDecor({ slot }: { slot: CardSlot }) {
  const config = cardDecorBySlot[slot];

  switch (config?.variant) {
    case "centered-image":
      return <div className="w-full h-full flex justify-center items-center"><img src={config.imagePath} className="w-full h-auto md:h-full md:w-auto p-1"></img></div>;
    case "decorative-text":
      return <div className="font-bebas bg-(--token-background-2) text-(--token-accent) w-full h-full flex justify-center items-center text-lg md:text-4xl">{config.text}</div>;
    case "corner-images":
      return (
        <div className="w-full h-full relative">
          <img src={config.topLeftImagePath} className="absolute top-0 left-0 h-[70%] w-auto md:w-[40%] md:h-auto"></img>
          <img src={config.bottomRightImagePath} className="absolute bottom-0 right-0 h-[70%] w-auto md:w-[40%] md:h-auto"></img>
        </div>
      );
    default:
      return null;
  }
}
