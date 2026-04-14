"use client";

import React from "react";

import styles from "./Card.module.css";

export type CardSize = "1" | "2" | "3" | "4" | "5" | "6" | "7";

type CardVariant = "background2" | "accent" | "gradient";

const variantClassName: Record<CardVariant, string> = {
  background2: "bg-background-2",
  accent: "bg-accent",
  gradient: "",
};

const sizeClassName: Record<CardSize, string> = {
  "1": styles.cardSize1,
  "2": styles.cardSize2,
  "3": styles.cardSize3,
  "4": styles.cardSize4,
  "5": styles.cardSize5,
  "6": styles.cardSize6,
  "7": styles.cardSize7,
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
  const isGradient = variant === "gradient";

  const style: React.CSSProperties = isGradient
    ? {
        background: `linear-gradient(to bottom, var(--token-background-2) 50%, var(--token-background) 100%)`,
      }
    : {};

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[20px]",
        sizeClassName[size],
        !isGradient ? variantClassName[variant] : undefined,
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
