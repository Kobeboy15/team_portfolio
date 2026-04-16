import { CardSlot } from "@/src/types/skills";

export type CardDecorVariant =
  | "decorative-text"
  | "centered-image"
  | "corner-images";

type DecorativeTextDecor = {
  variant: "decorative-text";
  text: string;
};

type CenteredImageDecor = {
  variant: "centered-image";
  imagePath: string;
};

type CornerImagesDecor = {
  variant: "corner-images";
  topLeftImagePath: string;
  bottomRightImagePath: string;
};

export type CardDecorConfig =
  | DecorativeTextDecor
  | CenteredImageDecor
  | CornerImagesDecor;

export const cardDecorBySlot: Record<CardSlot, CardDecorConfig> = {
  "1": { variant: "decorative-text", text: "코비 마이클" },
  "2": {
    variant: "centered-image",
    imagePath: "images/skills/skills-decor-circle.webp",
  },
  "3": {
    variant: "corner-images",
    topLeftImagePath: "images/skills/skills-decor-flower-left.webp",
    bottomRightImagePath: "images/skills/skills-decor-flower-right.webp",
  },
  "4": { variant: "decorative-text", text: "코비 마이클" },
  "5": {
    variant: "centered-image",
    imagePath: "images/skills/skills-decor-circle.webp",
  },
  "6": { variant: "decorative-text", text: "코비 마이클" },
  "7": {
    variant: "corner-images",
    topLeftImagePath: "images/skills/skills-decor-flower-left.webp",
    bottomRightImagePath: "images/skills/skills-decor-flower-right.webp",
  },
};
