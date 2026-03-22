export type HeadingSize =
  | "hero-1" // 134px, tracking +2%
  | "hero-2" // 172px, tracking +2%
  | "display-128" // 128px
  | "display-96" // 96px
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
  children: React.ReactNode;
};

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
}: HeadingProps) {
  return (
    <Component
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
