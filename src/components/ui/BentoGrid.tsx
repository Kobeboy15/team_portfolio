import { BentoItem } from "@/src/types/skills";
import { GridVariants } from "@/src/types/skills";

import { Card } from "./Card";
import { CardContent } from "./CardContent";
import { CardDecor } from "./CardDecor";

import { desktopGridVariants, mobileGridVariants } from "@/src/data/skills";

const COLS = 3;
const ROWS = 11;

const MOBILE_COLS = 2;
const MOBILE_ROWS = 5;

export function BentoGrid({ items, variant }: { items: BentoItem[]; variant?: number }) {
    const desktopCards = fillGrid(items, desktopGridVariants[(variant ?? 1) - 1]);
    const mobileCards = fillGrid(items, mobileGridVariants[(variant ?? 1) - 1]);

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
                    gridTemplateColumns: `repeat(${MOBILE_COLS}, 1fr)`,
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
    variants: GridVariants
): React.ReactElement[] {
    const cards: React.ReactElement[] = [];
    const usedSlots = new Set<string>(items.map((item) => item.slot));
    const allSlots = Object.keys(variants) as Array<keyof typeof variants>;

    for (const item of items) {
        cards.push(
            <div key={item.slot} style={variants[item.slot]}>
                <Card variant={item.cardVariant ?? "background2"}>
                    <CardContent content={item.content} />
                </Card>
            </div>
        );
    }

    for (const slot of allSlots) {
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