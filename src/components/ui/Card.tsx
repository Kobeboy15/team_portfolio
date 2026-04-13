"use client";

import React, { useEffect, useState } from "react";

export type CardSize = "1" | "2" | "3" | "4" | "5" | "6" | "7";

const sizeDimensions: Record<CardSize, { width: number; height: number }> = {
  "1": { width: 655, height: 236 },
  "2": { width: 325, height: 236 },
  "3": { width: 325, height: 286 },
  "4": { width: 325, height: 186 },
  "5": { width: 325, height: 436 },
  "6": { width: 325, height: 135 },
  "7": { width: 325, height: 235 },
};

const tabletSizeDimensions: Record<CardSize, { width: number; height: number }> = {
  "1": { width: 636, height: 236 },
  "2": { width: 318, height: 236 },
  "3": { width: 636, height: 236 },
  "4": { width: 318, height: 236 },
  "5": { width: 636, height: 236 },
  "6": { width: 318, height: 236 },
  "7": { width: 318, height: 236 },
};

const largeMobileSizeDimensions: Record<CardSize, { width: number; height: number }> = {
  "1": { width: 420, height: 236 },
  "2": { width: 210, height: 236 },
  "3": { width: 420, height: 236 },
  "4": { width: 210, height: 236 },
  "5": { width: 420, height: 236 },
  "6": { width: 210, height: 236 },
  "7": { width: 210, height: 236 },
};

const mobileSizeDimensions: Record<CardSize, { width: number; height: number }> = {
  "1": { width: 320, height: 236 },
  "2": { width: 160, height: 236 },
  "3": { width: 320, height: 236 },
  "4": { width: 160, height: 236 },
  "5": { width: 320, height: 236 },
  "6": { width: 160, height: 236 },
  "7": { width: 160, height: 236 },
};

const lgSizeDimensions: Record<CardSize, { width: number; height: number }> = {
  "1": { width: 720, height: 260 },
  "2": { width: 360, height: 260 },
  "3": { width: 360, height: 320 },
  "4": { width: 360, height: 200 },
  "5": { width: 360, height: 480 },
  "6": { width: 360, height: 150 },
  "7": { width: 360, height: 260 },
};

const xl2SizeDimensions: Record<CardSize, { width: number; height: number }> = {
  "1": { width: 820, height: 300 },
  "2": { width: 400, height: 300 },
  "3": { width: 400, height: 360 },
  "4": { width: 400, height: 220 },
  "5": { width: 400, height: 560 },
  "6": { width: 400, height: 170 },
  "7": { width: 400, height: 280 },
};

const breakpoints = [
  { query: "(min-width: 1536px)", dims: xl2SizeDimensions }, // 2xl
  { query: "(min-width: 1280px)", dims: lgSizeDimensions },  // lg
  { query: "(min-width: 1130px)", dims: sizeDimensions },
  { query: "(min-width: 700px)",  dims: tabletSizeDimensions },
  { query: "(min-width: 500px)",  dims: largeMobileSizeDimensions },
] as const;

function useResponsiveDimensions(size: CardSize) {
  const [dims, setDims] = useState(mobileSizeDimensions[size]);

  useEffect(() => {
    const mqls = breakpoints.map(({ query, dims }) => ({
      mql: window.matchMedia(query),
      dims,
    }));

    function update() {
      const match = mqls.find(({ mql }) => mql.matches);
      setDims(match ? match.dims[size] : mobileSizeDimensions[size]);
    }

    update();
    mqls.forEach(({ mql }) => mql.addEventListener("change", update));
    return () => mqls.forEach(({ mql }) => mql.removeEventListener("change", update));
  }, [size]);

  return dims;
}

type CardVariant = "background2" | "accent" | "gradient";

const variantClassName: Record<CardVariant, string> = {
  background2: "bg-background-2",
  accent: "bg-accent",
  gradient: "",
};

export type CardProps = React.PropsWithChildren<{
  size: CardSize;
  variant?: CardVariant;
  className?: string;
}>;

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function Card({ size, variant = "background2", className, children }: CardProps) {
  const dimensions = useResponsiveDimensions(size!);
  const isGradient = variant === "gradient";

  const style: React.CSSProperties = {
    ...dimensions,
    ...(isGradient && {
      background: `linear-gradient(to bottom, var(--token-background-2) 50%, var(--token-background) 100%)`,
    }),
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px]",
        !isGradient ? variantClassName[variant] : undefined,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}