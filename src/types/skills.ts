export type Skill = {
  order: number;
  name: string; // ie. "Design"
  bento: BentoContent[];
};

export type BentoContent =
  | {
      type: "heading"; // TODO: types enum?
      value: string;
    }
  | {
      type: "paragraph";
      value: string;
      heading?: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      heading?: string;
      caption?: string;
    }
  | {
      type: "icon";
      name: string;
    };
