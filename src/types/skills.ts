export type Skill = {
  order: number;
  name: string;            // ie. "Design"
  bento: BentoItem[];
  gridVariant?: number;
}

export type BentoItem = {
  slot: "card1" | "card2" | "card3" | "card4" | "card5" | "card6" | "card7";
  test?: number;
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

export type GridPlacement = {
    gridColumn: string;
    gridRow: string;
};

export type GridVariants = {
  card1: GridPlacement;
  card2: GridPlacement;
  card3: GridPlacement;
  card4: GridPlacement;
  card5: GridPlacement;
  card6: GridPlacement;
  card7: GridPlacement;
  card8?: GridPlacement;
}