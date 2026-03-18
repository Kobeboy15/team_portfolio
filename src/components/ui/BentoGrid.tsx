import { BentoContent } from "@/src/types/skills";

// #region Constants
// TODO: variation and/or dynamic sizes?
const COLS = 3;
const ROWS = 11;

const cardVariants: Record<string, { colSpan: number; rowSpan: number }> = { // TODO: variation and/or dynamic sizes?
  heading:      { colSpan: 2, rowSpan: 4 },
  paragraph:    { colSpan: 1, rowSpan: 5 },
  image:        { colSpan: 1, rowSpan: 3 },
  icon:         { colSpan: 1, rowSpan: 3 },
};
// #endregion

export function BentoGrid({ content }: { content: BentoContent[] }) {
    const cards = fillGrid(content);

  return (
    <div className="w-full h-full flex justify-center items-center">
        <div 
            className="gap-4 h-full w-full"
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

    const occupied: boolean[][] = Array(ROWS).fill(null).map(
        () => Array(COLS).fill(false)
    );

    var key = 0;

    let colSpan = 0;
    let rowSpan = 0;

    for (const item of content) {
        ({ colSpan, rowSpan } = cardVariants[item.type]);

        const position = findInterestingPosition(occupied, colSpan, rowSpan);
        
        if (!position) {  // TODO: handle case
            console.warn(`No space left for item type: ${item.type}`);
            continue;
        }

        const { col, row } = position;

        for (let r = row - 1; r < row - 1 + rowSpan; r++) {
            for (let c = col - 1; c < col - 1 + colSpan; c++) {
                if (r < ROWS && c < COLS) {
                    occupied[r][c] = true;
                }
            }
        }

        // TODO: placeholder, replace with actual content instead of metadata during a later ticket
        cards.push(<div key={`${key}`} style={{ gridColumn: `${col} / span ${colSpan}`, gridRow: `${row} / span ${rowSpan}` }} className="bg-indigo-200 text-black rounded-3xl flex justify-center items-center">{`${item.type} dimensions: ${colSpan}x${rowSpan}`}</div>);
        key++;
    }

    fillRemainingGaps(occupied, cards, key);

    return cards;
}

// TODO: rework all sizing&positioning logic at a later ticket, ignore for now
// #region Fill Content
function isSpaceAvailable(occupied: boolean[][], startCol: number, startRow: number, colSpan: number, rowSpan: number): boolean 
{
    for (let r = startRow - 1; r < startRow - 1 + rowSpan; r++) {
        for (let c = startCol - 1; c < startCol - 1 + colSpan; c++) {
            if (r >= ROWS || c >= COLS || occupied[r][c]) {
                return false;
            }
        }
    }
    return true;
}

function findInterestingPosition(occupied: boolean[][], colSpan: number, rowSpan: number): { col: number; row: number } | null {
    const possiblePositions: { col: number; row: number }[] = [];
    
    for (let row = 1; row <= ROWS - rowSpan + 1; row++) {
        for (let col = 1; col <= COLS - colSpan + 1; col++) {
            if (isSpaceAvailable(occupied, col, row, colSpan, rowSpan) && hasValidVerticalSpacing(occupied, col, row, colSpan, rowSpan)) {
                possiblePositions.push({ col, row });
            }
        }
    }
    
    // TODO: rework logic
    if (possiblePositions.length === 0) return null;
    
    const weightedPositions = possiblePositions.map(pos => {
        let weight = 1;
        
        const centerCol = Math.floor(COLS / 2);
        const centerRow = Math.floor(ROWS / 2);
        
        if (Math.abs(pos.col - centerCol) > 1) weight *= 1.5;
        if (Math.abs(pos.row - centerRow) > 2) weight *= 1.5;
        
        return { ...pos, weight };
    });
    
    return selectRandomWithWeight(weightedPositions);
}

interface WeightedPosition {col: number; row: number; weight: number;}

function selectRandomWithWeight(positions: WeightedPosition[]): { col: number; row: number } | null {
    if (positions.length === 0) return null;
    
    const totalWeight = positions.reduce((sum, pos) => sum + pos.weight, 0);
    
    let random = Math.random() * totalWeight;
    
    for (const pos of positions) {
        if (random < pos.weight) {
            return { col: pos.col, row: pos.row };
        }
        random -= pos.weight;
    }
    
    return { col: positions[0].col, row: positions[0].row };
}

// TODO: rework logic, prevent 1 row edges
function hasValidVerticalSpacing(occupied: boolean[][], col: number, row: number, colSpan: number, rowSpan: number): boolean 
{
    const startRow = row - 1;
    const endRow = startRow + rowSpan - 1;
    const startCol = col - 1;
    const endCol = startCol + colSpan - 1;
    
    if (startRow > 0) {
        const rowAbove = startRow - 1;
        let hasAdjacentAbove = false;
        
        for (let c = startCol; c <= endCol; c++) {
            if (occupied[rowAbove][c]) {
                hasAdjacentAbove = true;
                break;
            }
        }
        
        if (!hasAdjacentAbove && startRow > 1) {
            const twoRowsAbove = startRow - 2;
            let hasCardTwoRowsAbove = false;
            
            for (let c = startCol; c <= endCol; c++) {
                if (occupied[twoRowsAbove][c]) {
                    hasCardTwoRowsAbove = true;
                    break;
                }
            }
            
            if (hasCardTwoRowsAbove) {
                for (let c = startCol; c <= endCol; c++) {
                    if (occupied[rowAbove][c]) {
                        break;
                    }
                }
                return false;
            }
        }
    }
    
    if (endRow < ROWS - 1) {
        const rowBelow = endRow + 1;
        let hasAdjacentBelow = false;
        
        for (let c = startCol; c <= endCol; c++) {
            if (occupied[rowBelow][c]) {
                hasAdjacentBelow = true;
                break;
            }
        }
        
        if (!hasAdjacentBelow && endRow < ROWS - 2) {
            const twoRowsBelow = endRow + 2;
            let hasCardTwoRowsBelow = false;
            
            for (let c = startCol; c <= endCol; c++) {
                if (occupied[twoRowsBelow][c]) {
                    hasCardTwoRowsBelow = true;
                    break;
                }
            }
            
            if (hasCardTwoRowsBelow) {
                for (let c = startCol; c <= endCol; c++) {
                    if (occupied[rowBelow][c]) {
                        break;
                    }
                }
                return false;
            }
        }
    }
    
    return true;
}
// #endregion

// #region Fill Gaps
// TODO: debug overlap
function fillRemainingGaps(occupied: boolean[][], cards: React.ReactElement[], startKey: number): void 
{
    let key = startKey;
    
    for (let row = 1; row <= ROWS; row++) {
        for (let col = 1; col <= COLS; col++) {
            if (!occupied[row - 1][col - 1]) {
                const { colSpan, rowSpan } = findLargestAvailableSpace(occupied, col, row);
                
                if (colSpan > 0 && rowSpan > 0) {
                    for (let r = row - 1; r < row - 1 + rowSpan; r++) {
                        for (let c = col - 1; c < col - 1 + colSpan; c++) {
                            if (r < ROWS && c < COLS) {
                                occupied[r][c] = true;
                            }
                        }
                    }
                    
                    // TODO: placeholder, replace with actual content instead of metadata during a later ticket
                    cards.push(
                        <div key={`${key}`} style={{ gridColumn: `${col} / span ${colSpan}`, gridRow: `${row} / span ${rowSpan}` }} className="bg-gray-200 text-black rounded-3xl flex justify-center items-center"
                        >
                            {`decor dimensions: ${colSpan}x${rowSpan}`}
                        </div>
                    );
                    key++;
                }
            }
        }
    }
}

function findLargestAvailableSpace(occupied: boolean[][], startCol: number, startRow: number): { colSpan: number; rowSpan: number } 
{
    let maxColSpan = 0;
    let maxRowSpan = 0;
    
    for (let c = startCol - 1; c < COLS; c++) {
        if (!occupied[startRow - 1][c]) {
            maxColSpan++;
        } else {
            break;
        }
    }
    
    for (let colSpan = 1; colSpan <= maxColSpan; colSpan++) {
        let rowSpan = 1;
        let possible = true;
        
        while (possible) {
            if (startRow - 1 + rowSpan >= ROWS) {
                break;
            }
            
            for (let c = startCol - 1; c < startCol - 1 + colSpan; c++) {
                if (startRow - 1 + rowSpan >= ROWS) {
                    possible = false;
                    break;
                }
                
                if (occupied[startRow - 1 + rowSpan][c]) {
                    possible = false;
                    break;
                }
            }
            
            if (possible) {
                rowSpan++;
            }
        }
        
        if (rowSpan > maxRowSpan) {
            maxRowSpan = rowSpan;
        }
    }
    
    return { colSpan: maxColSpan, rowSpan: maxRowSpan };
}
// #endregion