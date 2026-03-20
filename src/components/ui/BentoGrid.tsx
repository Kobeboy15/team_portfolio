import { BentoContent } from "@/src/types/skills";

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
    // TODO: switch to Card component once sizing is finalized
    cards.push(<div key={1} style={VARIANTS.card1} className="bg-(--token-background-2) rounded-3xl flex justify-center items-center">Card 1</div>);
    cards.push(<div key={2} style={VARIANTS.card2} className="bg-(--token-accent) rounded-3xl flex justify-center items-center">Card 2</div>);
    cards.push(<div key={3} style={VARIANTS.card3} className="bg-(--token-background-2) rounded-3xl flex justify-center items-center">Card 3</div>);
    cards.push(<div key={4} style={VARIANTS.card4} className="bg-(--token-background-2) rounded-3xl flex justify-center items-center">Card 4</div>);
    cards.push(<div key={5} style={VARIANTS.card5} className="bg-(--token-background-2) rounded-3xl flex justify-center items-center">Card 5</div>);
    cards.push(<div key={6} style={VARIANTS.card6} className="bg-(--token-background-2) rounded-3xl flex justify-center items-center">Card 6</div>);
    cards.push(<div key={7} style={VARIANTS.card7} className="bg-(--token-accent) rounded-3xl flex justify-center items-center">Card 7</div>);

    return cards;
}