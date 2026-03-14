"use client";
import React from "react";
import Link from "next/link";

const baseClassName =
  "inline-flex h-9 min-h-9 items-center gap-2 font-sans font-light text-sora-18 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type BaseProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
};

type ButtonPropsAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

type ButtonPropsAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
  };

export type ButtonProps = ButtonPropsAsLink | ButtonPropsAsButton;

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function Button({
  children,
  icon,
  className,
  href,
  ...rest
}: ButtonProps) {
  const content = (
    <>
      {children}
      {icon ? <span className="inline-flex shrink-0" aria-hidden>{icon}</span> : null}
    </>
  );

  if (href !== undefined && href !== null) {
    const linkClassName = cn(baseClassName, className);
    const anchorRest = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    if (isInternalHref(href)) {
      return (
        <Link href={href} className={linkClassName} {...anchorRest}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} className={linkClassName} {...anchorRest}>
        {content}
      </a>
    );
  }

  const buttonRest = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  const { type = "button", ...buttonProps } = buttonRest;
  return (
    <button
      type={type}
      className={cn(baseClassName, className)}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
