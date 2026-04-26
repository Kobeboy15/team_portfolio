"use client";

import type { ReactNode } from "react";

type HoverRollProps = {
  children: ReactNode;
  /** Extra classes for the outer clip wrapper. */
  className?: string;
  /** Extra classes for the outer clip wrapper. */
  wrapperClassName?: string;
  /** Extra classes for the animated track. */
  trackClassName?: string;
  /** Extra classes for each row. */
  rowClassName?: string;
  /**
   * Classes applied to the "accent" duplicate copy.
   * Defaults to `text-accent`.
   */
  accentClassName?: string;
};

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Display-only hover treatment.
 *
 * Requirements:
 * - Hit area must remain stable: inner content uses pointer-events: none.
 * - Efficient: transform-only animation on the track.
 * - Reduced motion: handled via global CSS + Tailwind motion-reduce utilities.
 *
 * Triggered by a parent element with class `hoverRoll-group`.
 */
export function HoverRoll({
  children,
  className,
  wrapperClassName,
  trackClassName,
  rowClassName,
  accentClassName = "text-accent",
}: HoverRollProps) {
  return (
    <span
      className={cn(
        // Single-row viewport: ensures only one copy is visible at a time.
        "hoverRoll inline-block overflow-hidden align-baseline leading-none h-[var(--hover-roll-size,1em)]",
        wrapperClassName,
        className,
      )}
    >
      <span
        className={cn(
          "hoverRoll-track flex flex-col will-change-transform motion-reduce:transform-none motion-reduce:transition-none",
          trackClassName,
        )}
      >
        <span
          className={cn(
            "hoverRoll-row pointer-events-none flex items-center leading-none h-[var(--hover-roll-size,1em)]",
            rowClassName,
          )}
        >
          {children}
        </span>
        <span
          className={cn(
            "hoverRoll-row pointer-events-none flex items-center leading-none h-[var(--hover-roll-size,1em)]",
            rowClassName,
            accentClassName,
          )}
        >
          {children}
        </span>
      </span>
    </span>
  );
}

