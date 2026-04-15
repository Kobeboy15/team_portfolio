import type { ReactNode } from "react";

type HeroImageColumnProps = {
  className?: string;
  children: ReactNode;
};

/** Layout wrapper for the hero image column (flex sizing unchanged from pre-flight). */
export function HeroImageColumn({ className, children }: HeroImageColumnProps) {
  return <div className={className}>{children}</div>;
}
