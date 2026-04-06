import type { CSSProperties, ReactNode } from "react";

export function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

export function contentHeightStyle(px: number): CSSProperties {
  return { height: px };
}

export function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="h-3.5 w-3.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9L9 3M4 3H9V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LinkPlaceholder({ children }: { children: ReactNode }) {
  return (
    <span
      className="invisible inline-flex select-none items-center gap-2 font-sans text-sora-14 font-light"
      aria-hidden
    >
      {children}
    </span>
  );
}
