import { BentoItem } from "@/src/types/skills";
import { GridVariants, CardSlot } from "@/src/types/skills";

import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { CardDecor } from "./CardDecor";

import { desktopGridVariants, mobileGridVariants } from "@/src/data/skills";

const COLS = 3;
const ROWS = 11;

const MOBILE_COLS = 2;
const MOBILE_ROWS = 7;

export function BentoGrid({ items, variant }: { items: BentoItem[]; variant?: number }) {
    const variantIndex = Math.min(
        Math.max((variant ?? 1) - 1, 0),
        desktopGridVariants.length - 1
    );
 
    const desktopCards = fillGrid(items, desktopGridVariants[variantIndex]);
    const mobileCards = fillGrid(
        items,
        mobileGridVariants[Math.min(variantIndex, mobileGridVariants.length - 1)]
    );

    return (
        <div className="flex justify-center items-center">
            {/* Desktop grid */}
            <div
                className="hidden desktop-grid gap-3"
                style={{
                    gridTemplateColumns: `repeat(${COLS}, auto)`,
                    gridTemplateRows: `repeat(${ROWS}, auto)`,
                }}
            >
                {desktopCards}
            </div>

            {/* Mobile grid */}
            <div
                className="grid mobile-display gap-1"
                style={{
                    gridTemplateColumns: `repeat(${MOBILE_COLS}, auto)`,
                    gridTemplateRows: `repeat(${MOBILE_ROWS}, auto)`,
                }}
            >
                {mobileCards}
            </div>
        </div>
    );
}

function fillGrid(
    items: BentoItem[],
    variants: GridVariants
): React.ReactElement[] {
    const cards: React.ReactElement[] = [];
    const usedSlots = new Set<CardSlot>(items.map((item) => item.slot));
    const allSlots = Object.keys(variants) as CardSlot[];

    for (const item of items) {
        cards.push(
            <div key={item.slot} style={variants[item.slot]}>
                <Card variant={item.cardVariant ?? "background2"}  size={item.slot}>
                    <CardContent content={item.content} />
                </Card>
            </div>
        );
    }

    for (const slot of allSlots) {
        if (!usedSlots.has(slot)) {
            cards.push(
                <div key={slot} style={variants[slot]}>
                    <Card variant="accent" size={slot}>
                        <CardDecor slot={slot} />
                    </Card>
                </div>
            );
        }
    }

    return cards;
}