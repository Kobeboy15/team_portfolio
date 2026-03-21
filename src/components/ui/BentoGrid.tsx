import { BentoContent } from "@/src/types/skills";

import { Card } from "./Card";

const COLS = 3;
const ROWS = 11;

const VARIANTS = {
    card1: { gridColumn: "1 / span 2", gridRow: "1 / span 4" },
    card2: { gridColumn: "3 / span 1", gridRow: "1 / span 4" },
    card3: { gridColumn: "1 / span 1", gridRow: "5 / span 5" },
    card4: { gridColumn: "2 / span 1", gridRow: "5 / span 3" },
    card5: { gridColumn: "3 / span 1", gridRow: "5 / span 7" },
    card6: { gridColumn: "1 / span 1", gridRow: "10 / span 2" },
    card7: { gridColumn: "2 / span 1", gridRow: "8 / span 4" },

};

export function BentoGrid({ content }: { content: BentoContent[] }) {
    const cards = fillGrid(content);

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

function fillGrid(content: BentoContent[]): React.ReactElement[] {
    const cards: React.ReactElement[] = [];

    // TODO: placeholders, will replace with content in a later ticket
    cards.push(<div key={1} style={VARIANTS.card1}><Card className="flex justify-center items-center">Card 1</Card></div>);
    cards.push(<div key={2} style={VARIANTS.card2}><Card variant="accent" className="flex justify-center items-center">Card 2</Card></div>);
    cards.push(<div key={3} style={VARIANTS.card3}><Card variant="gradient" className="flex justify-center items-center">Card 3</Card></div>);
    cards.push(<div key={4} style={VARIANTS.card4}><Card className="flex justify-center items-center">Card 4</Card></div>);
    cards.push(<div key={5} style={VARIANTS.card5}><Card className="flex justify-center items-center">Card 5</Card></div>);
    cards.push(<div key={6} style={VARIANTS.card6}><Card className="flex justify-center items-center">Card 6</Card></div>);
    cards.push(<div key={7} style={VARIANTS.card7}><Card variant="accent" className="flex justify-center items-center">Card 7</Card></div>);

    return cards;
}