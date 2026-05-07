import type { HTMLAttributes, ReactNode } from "react";

export type HeadingSize =
  | "hero-1" // 134px, tracking +2%
  | "hero-2" // 172px, tracking +2%
  | "display-128" // 128px
  | "display-96" // 96px
  | "display-80" // 80px / 5rem — project card title (xl); local to Heading, not global tokens
  | "display-64" // 64px / 4rem — project card title (lg); local to Heading, not global tokens
  | "display-48" // 48px
  | "years"; // 218px, tracking -5%

export type HeadingTone = "foreground" | "accent" | "foreground-secondary";

export type HeadingAs = "h1" | "h2" | "h3" | "h4" | "p" | "span";

export type HeadingProps = {
  /**
   * Visual size token, mapped from Figma.
   */
  size: HeadingSize;

  /**
   * Color / tone of the heading text.
   * - "foreground": main text color
   * - "accent": accent color
   * - "foreground-secondary": special display heading color
   */
  tone?: HeadingTone;

  /**
   * Semantic HTML element. Does not affect visual size.
   */
  as?: HeadingAs;

  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

const sizeClassName: Record<HeadingSize, string> = {
  "hero-1":
    "text-header-1 leading-[var(--text-header-1--line-height)] tracking-display",
  "hero-2":
    "text-header-2 leading-[var(--text-header-2--line-height)] tracking-display",
  years: "text-years leading-[var(--text-years--line-height)] tracking-years",
  "display-128": "text-display-128",
  "display-96": "text-display-96",
  "display-80": "text-[5rem] leading-[0.8]",
  "display-64": "text-[4rem] leading-[0.8]",
  "display-48": "text-display-48",
};

const toneClassName: Record<HeadingTone, string> = {
  foreground: "text-foreground",
  accent: "text-accent",
  "foreground-secondary": "text-foreground-secondary",
};

export function Heading({
  size,
  tone = "foreground",
  as: Component = "h2",
  className,
  children,
  ...rest
}: HeadingProps) {
  return (
    <Component
      {...rest}
      className={cx(
        "font-bebas uppercase",
        sizeClassName[size],
        toneClassName[tone],
        className,
      )}
    >
      {children}
    </Component>
  );
}
