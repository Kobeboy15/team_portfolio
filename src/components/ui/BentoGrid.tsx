import { BentoItem } from "@/src/types/skills";

import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { CardDecor } from "./CardDecor";

const COLS = 3;
const ROWS = 11;

// Desktop layout (3-col)
export const VARIANTS = {
    card1: { gridColumn: "1 / span 2", gridRow: "1 / span 4" },
    card2: { gridColumn: "3 / span 1", gridRow: "1 / span 4" },
    card3: { gridColumn: "1 / span 1", gridRow: "5 / span 5" },
    card4: { gridColumn: "2 / span 1", gridRow: "5 / span 3" },
    card5: { gridColumn: "3 / span 1", gridRow: "5 / span 7" },
    card6: { gridColumn: "1 / span 1", gridRow: "10 / span 2" },
    card7: { gridColumn: "2 / span 1", gridRow: "8 / span 4" },
};

// Mobile layout (2-col)
const MOBILE_VARIANTS: typeof VARIANTS = {
    card1: { gridColumn: "1 / span 2", gridRow: "1 / span 1" },
    card2: { gridColumn: "1 / span 1", gridRow: "2 / span 1" },
    card3: { gridColumn: "1 / span 2", gridRow: "3 / span 1" },
    card4: { gridColumn: "2 / span 1", gridRow: "2 / span 1" },
    card5: { gridColumn: "1 / span 2", gridRow: "5 / span 1" },
    card6: { gridColumn: "1 / span 1", gridRow: "4 / span 1" },
    card7: { gridColumn: "2 / span 1", gridRow: "4 / span 1" },
};

const MOBILE_ROWS = 5;

const ALL_SLOTS = Object.keys(VARIANTS) as Array<keyof typeof VARIANTS>;

export function BentoGrid({ items }: { items: BentoItem[] }) {
    const desktopCards = fillGrid(items, VARIANTS);
    const mobileCards = fillGrid(items, MOBILE_VARIANTS);

    return (
        <div className="w-full h-full flex justify-center items-center">
            {/* Desktop grid */}
            <div
                className="hidden md:grid gap-1 md:gap-3 h-full w-full"
                style={{
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                }}
            >
                {desktopCards}
            </div>

            {/* Mobile grid */}
            <div
                className="grid md:hidden gap-1 h-full w-full"
                style={{
                    gridTemplateColumns: `repeat(2, 1fr)`,
                    gridTemplateRows: `repeat(${MOBILE_ROWS}, 1fr)`,
                }}
            >
                {mobileCards}
            </div>
        </div>
    );
}

function fillGrid(
    items: BentoItem[],
    variants: typeof VARIANTS
): React.ReactElement[] {
    const cards: React.ReactElement[] = [];
    const usedSlots = new Set(items.map((item) => item.slot));

    for (const item of items) {
        cards.push(
            <div key={item.slot} style={variants[item.slot]}>
                <Card variant={item.cardVariant ?? "background2"}>
                    <CardContent content={item.content} />
                </Card>
            </div>
        );
    }

    for (const slot of ALL_SLOTS) {
        if (!usedSlots.has(slot)) {
            cards.push(
                <div key={slot} style={variants[slot]}>
                    <Card variant="accent">
                        <CardDecor slot={slot} />
                    </Card>
                </div>
            );
        }
    }

    return cards;
}