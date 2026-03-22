import React from "react";

type CardSize = "1" | "2" | "3" | "4" | "5" | "6" | "7";

const sizeDimensions: Record<
  CardSize,
  { width: number; height: number }
> = {
  "1": { width: 636, height: 236 },
  "2": { width: 336, height: 236 },
  "3": { width: 311, height: 286 },
  "4": { width: 311, height: 186 },
  "5": { width: 336, height: 436 },
  "6": { width: 311, height: 135 },
  "7": { width: 311, height: 235 },
};

type CardVariant = "background2" | "accent" | "gradient";

const variantClassName: Record<CardVariant, string> = {
  background2: "bg-background-2",
  accent: "bg-accent",
  gradient: "", // applied via inline style
};

export type CardProps = React.PropsWithChildren<{
  /**
   * Preset size from Figma (card 1–7).
   */
  size?: CardSize;

  /**
   * Background: solid background2, solid accent, or linear gradient (background2 → background).
   */
  variant?: CardVariant;

  className?: string;
}>;

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function Card({
  size,
  variant = "background2",
  className,
  children,
}: CardProps) {
  const dimensions = size ? sizeDimensions[size] : undefined;
  const isGradient = variant === "gradient";

  const style: React.CSSProperties = {
    ...(dimensions ? { width: dimensions.width, height: dimensions.height } : {}),
    ...(isGradient
      ? {
          background: `linear-gradient(to bottom, var(--token-background-2) 50%, var(--token-background) 100%)`,
        }
      : {}),
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px]",
        !dimensions ? "w-full h-full" : undefined,
        !isGradient ? variantClassName[variant] : undefined,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
