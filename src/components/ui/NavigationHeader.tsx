"use client";

import Link from "next/link";
import { useState } from "react";

export function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const navItems = ["About", "Expertise", "Projects", "Contact"];

  return (
    <header className="fixed top-0 left-0 z-50 h-[72px] w-full">
      <div className="flex items-center justify-between h-full px-16 py-[18px]">
        {/* Home button / brand */}
        <Link
          href="/#top"
          className="text-sora-24 font-extrabold tracking-tight text-foreground"
        >
          Kobe
        </Link>

        {/* Right side: nav + hamburger */}
        <div className="flex items-center gap-6">
          {/* Nav links — slide in from right to left */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out
              ${isOpen ? "max-w-[700px]" : "max-w-0"}`}
          >
            <nav
              className={`flex items-center gap-8 pr-2 whitespace-nowrap
                transition-transform duration-500 ease-in-out
                ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-lg font-bold
                             hover:underline underline-offset-4 decoration-[3px]
                             transition-all duration-150"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Hamburger / X button */}
          <button
            onClick={toggle}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="relative flex items-center justify-center
                       rounded-full w-[50px] h-[50px] bg-slate-700
                       border-[3px] border-black
                       shadow-[4px_4px_0_0_#000]
                       active:shadow-none active:translate-x-[4px] active:translate-y-[4px]
                       transition-all duration-200"
          >
            <div className="flex flex-col justify-between w-[20px] h-[20px] overflow-hidden">
              <div
                className={`bg-white h-[2px] w-7 transition-all duration-300 origin-left
                  ${isOpen ? "translate-x-10" : ""}`}
              />
              <div
                className={`bg-white h-[2px] w-7 rounded transition-all duration-300 delay-75
                  ${isOpen ? "translate-x-10" : ""}`}
              />
              <div
                className={`bg-white h-[2px] w-7 transition-all duration-300 origin-left delay-150
                  ${isOpen ? "translate-x-10" : ""}`}
              />

              <div
                className={`absolute top-2.5 flex items-center justify-between
                  transition-all duration-500
                  ${isOpen ? "translate-x-0 w-12" : "-translate-x-10 w-0"}`}
              >
                <div
                  className={`absolute bg-white h-[2px] w-5 transition-all duration-500 delay-300
                    ${isOpen ? "rotate-45" : "rotate-0"}`}
                />
                <div
                  className={`absolute bg-white h-[2px] w-5 transition-all duration-500 delay-300
                    ${isOpen ? "-rotate-45" : "rotate-0"}`}
                />
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}