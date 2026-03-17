"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";

export function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);
  const [visible, setVisible] = useState(true);
 
  const lastScrollY = useRef(0);
 
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
 
      if (currentScrollY < 10) {
        // Always show at the very top
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down → hide
        setVisible(false);
        setIsOpen(false); // also close menu if open
      } else {
        // Scrolling up → show
        setVisible(true);
      }
 
      lastScrollY.current = currentScrollY;
    };
 
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = ["About", "Expertise", "Projects", "Contact"];

  return (
    <header className={`bg-background fixed top-0 left-0 z-50 h-18 w-full
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "-translate-y-full"}
    `}>
      <div className="flex items-center justify-between h-full px-16 py-4">
        {/* Home button / brand */}
        <Link href="/" className="text-sora-24 font-extrabold tracking-tight text-foreground">
          Kobe
        </Link>

        {/* Navigation links + hamburger */}
        <div className="flex items-center">
          {/* Nav links — slide in from right to left */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out
              ${isOpen ? "max-w-[700px]" : "max-w-0"}`}
          >
            <nav
              className={`flex items-center gap-4 pr-2 whitespace-nowrap
                transition-transform duration-500 ease-in-out
                ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              {navItems.map((item) => (
                <Button key={item} href={`#${item.toLowerCase()}`}>
                  {item}
                </Button>
              ))}

              <ThemeToggle />
            </nav>
          </div>

          {/* Hamburger / X button */}
          <button
            onClick={toggle}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="relative flex items-center justify-center
                       w-9 h-9
                       cursor-pointer
                       transition-all duration-200"
          >
            <div className="flex flex-col justify-between w-5 h-5 overflow-hidden relative">
              <div
                className={`bg-foreground h-[2px] w-5 transition-all duration-300 origin-left
                  ${isOpen ? "translate-x-10" : ""}`}
              />
              <div
                className={`bg-foreground h-[2px] w-5 rounded transition-all duration-300 delay-75
                  ${isOpen ? "translate-x-10" : ""}`}
              />
              <div
                className={`bg-foreground h-[2px] w-4 transition-all duration-300 origin-left delay-150
                  ${isOpen ? "translate-x-10" : ""}`}
              />

              <div
                className={`absolute top-2.5 flex items-center justify-between
                  transition-all duration-500
                  ${isOpen ? "translate-x-0 w-12" : "-translate-x-10 w-0"}`}
              >
                <div
                  className={`absolute bg-foreground h-[2px] w-5 transition-all duration-500 delay-300
                    ${isOpen ? "rotate-45" : "rotate-0"}`}
                />
                <div
                  className={`absolute bg-foreground h-[2px] w-5 transition-all duration-500 delay-300
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
