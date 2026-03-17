export type Skill = {
  order: number;
  name: string;            // ie. "Design"
  bento: BentoContent[];
}

export type BentoContent =
  | {
      type: "heading";
      value: string;
      colSpan?: number;
      rowSpan?: number;
    }
  | {
      type: "paragraph";
      value: string;
      heading?: string,
      colSpan?: number;
      rowSpan?: number;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      heading?: string,
      caption?: string;
      colSpan?: number;
      rowSpan?: number;
    }
  | {
      type: "icon";
      name: string;
      colSpan?: number;
      rowSpan?: number;
    }
  | {
      type: "decoration";
      variant: string;
      colSpan?: number;
      rowSpan?: number;
    };