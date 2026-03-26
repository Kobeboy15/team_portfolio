import { BentoItem } from "@/src/types/skills";

import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { CardDecor } from "./CardDecor";

const COLS = 3;
const ROWS = 11;

export const VARIANTS = {
    card1: { gridColumn: "1 / span 2", gridRow: "1 / span 4" },
    card2: { gridColumn: "3 / span 1", gridRow: "1 / span 4" },
    card3: { gridColumn: "1 / span 1", gridRow: "5 / span 5" },
    card4: { gridColumn: "2 / span 1", gridRow: "5 / span 3" },
    card5: { gridColumn: "3 / span 1", gridRow: "5 / span 7" },
    card6: { gridColumn: "1 / span 1", gridRow: "10 / span 2" },
    card7: { gridColumn: "2 / span 1", gridRow: "8 / span 4" },

};

const ALL_SLOTS = Object.keys(VARIANTS) as Array<keyof typeof VARIANTS>;

export function BentoGrid({ items }: { items: BentoItem[] }) {
    const cards = fillGrid(items);

  return (
    <div className="w-full h-full flex justify-center items-center">
        <div 
            className="gap-1 md:gap-3 h-full w-full"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
        >
            {cards}
        </div>
    </div>
  );
}

function fillGrid(items: BentoItem[]): React.ReactElement[] {
    const cards: React.ReactElement[] = [];
    const usedSlots = new Set(items.map(item => item.slot));

    for (const item of items)
    {
        cards.push(<div key={item.slot} style={VARIANTS[item.slot]}><Card variant={item.cardVariant ?? "background2"}><CardContent content={item.content}></CardContent></Card></div>);
    }

    for (const slot of ALL_SLOTS) {
        if (!usedSlots.has(slot)) {
            cards.push(<div key={slot} style={VARIANTS[slot]}><Card variant="accent"><CardDecor slot={slot}></CardDecor></Card></div>);
        }
    }

    return cards;
}