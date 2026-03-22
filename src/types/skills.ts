export type Skill = {
  order: number;
  name: string;            // ie. "Design"
  bento: BentoItem[];
}

export type BentoItem = {
  slot: "card1" | "card2" | "card3" | "card4" | "card5" | "card6" | "card7";
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