"use client";

import { createContext, useContext, type ReactNode } from "react";

export type HeroAboutImageContextValue = {
  /** lg (1024px) and user has not requested reduced motion */
  flightActive: boolean;
  /** When true, hero shows empty slot; about shows in-flow ImageFrame */
  dockedInAbout: boolean;
  registerHeroSlot: (el: HTMLElement | null) => void;
  registerAboutSlot: (el: HTMLElement | null) => void;
};

export const HeroAboutImageContext =
  createContext<HeroAboutImageContextValue | null>(null);

export function useHeroAboutImage() {
  return useContext(HeroAboutImageContext);
}

export function HeroAboutImageContextProvider({
  value,
  children,
}: {
  value: HeroAboutImageContextValue;
  children: ReactNode;
}) {
  return (
    <HeroAboutImageContext.Provider value={value}>
      {children}
    </HeroAboutImageContext.Provider>
  );
}
