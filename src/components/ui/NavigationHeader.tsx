"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { HamburgerIcon } from "./HamburgerIcon";

export function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);
  const [visible, setVisible] = useState(true);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
        setIsOpen(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open (mobile only)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const updateOverflow = () => {
      document.body.style.overflow = isOpen && mq.matches ? "hidden" : "";
    };
    updateOverflow();
    mq.addEventListener("change", updateOverflow);
    return () => {
      mq.removeEventListener("change", updateOverflow);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navItems = ["About", "Expertise", "Projects", "Contact"];

  return (
    <>
      <header
        className={`bg-background fixed top-0 left-0 z-50 h-18 w-screen
          transition-transform duration-300 ease-in-out
          ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center justify-between h-full px-6 md:px-16 py-4">
          {/* Home button / brand */}
          <Link href="/" className="text-sora-24 font-extrabold tracking-tight text-foreground">
            Kobe
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center">
            <div
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-w-[700px]" : "max-w-0"}`}
            >
              <nav
                className={`flex items-center gap-4 pr-2 whitespace-nowrap transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
              >
                {navItems.map((item) => (
                  <Button key={item} href={`#${item.toLowerCase()}`}>
                    {item}
                  </Button>
                ))}
                <ThemeToggle />
              </nav>
            </div>
            <HamburgerIcon isOpen={isOpen} onToggle={toggle} />
          </div>

          {/* ── Mobile: only hamburger ── */}
          <div className="flex md:hidden">
            <HamburgerIcon isOpen={isOpen} onToggle={toggle} />
          </div>
        </div>
      </header>

      {/* ── Mobile full-screen slide-down menu ── */}
      <div
        aria-hidden={!isOpen || !visible}
        inert={!isOpen || !visible}
        className={`md:hidden fixed inset-0 z-40 bg-background flex flex-col
          transition-transform duration-500 ease-in-out
          ${isOpen && visible ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"}`}
      >
        {/* Top row — mirrors the header so brand + X stay in place */}
        <div className="flex items-center justify-between h-18 px-6 py-4 shrink-0">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-sora-24 font-extrabold tracking-tight text-foreground">
            Kobe
          </Link>
          <HamburgerIcon isOpen={isOpen} onToggle={toggle} />
        </div>

        {/* Nav links — vertical, staggered fade-in */}
        <nav className="flex flex-col items-start justify-center flex-1 gap-6 px-6 pb-16">
          {navItems.map((item, i) => (
            <div
              key={item}
              className={`transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: isOpen ? `${150 + i * 60}ms` : "0ms" }}
            >
              <Button href={`#${item.toLowerCase()}`} onClick={() => setIsOpen(false)}>
                {item}
              </Button>
            </div>
          ))}

          <div
            className={`transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: isOpen ? `${150 + navItems.length * 60}ms` : "0ms" }}
          >
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </>
  );
}
