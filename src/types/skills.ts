export type Skill = {
  id: string;              // ie. "01", "02" — display number
  name: string;            // ie. "Design"
  bento: BentoContent[];
}

export type BentoContent =
  | { type: "text"; value: string }
  | { type: "image"; src: string; alt: string; caption?: string }