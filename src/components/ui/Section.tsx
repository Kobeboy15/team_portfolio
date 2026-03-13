import React from "react";

type SectionSpacing = "none" | "sm" | "md" | "lg";

const spacingClassName: Record<SectionSpacing, string> = {
  none: "",
  sm: "py-10 sm:py-14",
  md: "py-14 sm:py-20",
  lg: "py-20 sm:py-28",
};

export type SectionProps = React.PropsWithChildren<{
  /**
   * Optional id for anchor links: <Section id="about" />
   */
  id?: string;
  className?: string;

  /**
   * Vertical padding preset for the section wrapper.
   * Use "none" for sections that intentionally overlap/stack.
   */
  spacing?: SectionSpacing;

  /**
   * If you have a fixed navbar, pass its height so anchor links
   * land below it (via scroll-margin-top).
   *
   * Example: navHeight="72px"
   */
  navHeight?: React.CSSProperties["scrollMarginTop"];

  /**
   * Adds a responsive section-to-section gap (margin-bottom).
   */
  withSectionGap?: boolean;

  /**
   * CSS length for the section-to-section gap when enabled.
   * Defaults to a chaos-friendly responsive clamp().
   */
  sectionGap?: React.CSSProperties["marginBottom"];
}>;

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Section({
  id,
  children,
  className,
  spacing = "md",
  navHeight,
  withSectionGap = false,
  sectionGap = "clamp(48px, 6vw, 140px)",
}: SectionProps) {
  const style: React.CSSProperties = {
    scrollMarginTop: navHeight,
    marginBottom: withSectionGap ? sectionGap : undefined,
  };

  return (
    <section
      id={id}
      style={style}
      className={cx(spacingClassName[spacing], className)}
    >
      {children}
    </section>
  );
}

