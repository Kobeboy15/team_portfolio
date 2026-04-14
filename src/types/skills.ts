export type Skill = {
  order: number;
  name: string;            // ie. "Design"
  bento: BentoItem[];
  gridVariant?: number;
}

export type BentoItem = {
  slot: CardSlot;
  content: BentoContent;
  cardVariant?: "background2" | "accent" | "gradient";
}

export type BentoContent =
  | {
      type: "heading"; // TODO: types enum?
      value: string;
    }
  | {
      type: "sub-heading";
      value: string;
    }
  | {
      type: "paragraph";
      value: string;
      heading?: string;
    }
  | {
      type: "icon";
      icon: Icon;
    }
  |
    {
      type: "icon-carousel";
      icons: Icon[];
      heading?: string;
      caption?: string;
    };

export type Icon = {
  name: string;
  path: string;
};

export type CardSlot = "1" | "2" | "3" | "4" | "5" | "6" | "7";

export type GridPlacement = {
    gridColumn: string;
    gridRow: string;
};

export type GridVariants = {
  1: GridPlacement;
  2: GridPlacement;
  3: GridPlacement;
  4: GridPlacement;
  5: GridPlacement;
  6: GridPlacement;
  7: GridPlacement;
}