"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { NavigationItem } from "@/src/data/navigation";

import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { HamburgerIcon } from "./HamburgerIcon";

interface NavigationHeaderProps {
  brandName: string;
  brandHref: string;
  navItems: NavigationItem[];
}

const FOCUSABLE_SELECTOR =
  'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function NavigationHeader({
  brandName,
  brandHref,
  navItems,
}: NavigationHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isInHero, setIsInHero] = useState(false);
  const [isInContact, setIsInContact] = useState(false);

  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const desktopNavRef = useRef<HTMLElement | null>(null);
  const mobileNavRef = useRef<HTMLElement | null>(null);
  const desktopHamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileHamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const pendingOpenFocusRef = useRef<"desktop" | "mobile" | null>(null);
  const pendingRestoreFocusRef = useRef<HTMLElement | null>(null);
  const lastOpenerRef = useRef<"desktop" | "mobile" | null>(null);

  const getFirstFocusable = useCallback(
    (container: HTMLElement | null) =>
      container?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ?? null,
    []
  );

  const getRestoreTarget = useCallback((opener: "desktop" | "mobile" | null) => {
    if (opener === "mobile") return mobileHamburgerRef.current;
    if (opener === "desktop") return desktopHamburgerRef.current;
    return null;
  }, []);

  const openDesktopNav = useCallback(() => {
    lastOpenerRef.current = "desktop";
    pendingRestoreFocusRef.current = null;
    pendingOpenFocusRef.current = "desktop";
    setIsOpen(true);
  }, []);

  const openMobileNav = useCallback(() => {
    lastOpenerRef.current = "mobile";
    pendingRestoreFocusRef.current = null;
    pendingOpenFocusRef.current = "mobile";
    setIsOpen(true);
  }, []);

  const closeNav = useCallback(({
    restoreFocus = true,
    restoreTarget,
  }: {
    restoreFocus?: boolean;
    restoreTarget?: HTMLElement | null;
  } = {}) => {
    pendingOpenFocusRef.current = null;
    pendingRestoreFocusRef.current = restoreFocus
      ? restoreTarget ?? getRestoreTarget(lastOpenerRef.current)
      : null;
    setIsOpen(false);
  }, [getRestoreTarget]);

  const toggleDesktopNav = useCallback(() => {
    if (isOpen) {
      closeNav({ restoreTarget: desktopHamburgerRef.current });
      return;
    }

    openDesktopNav();
  }, [closeNav, isOpen, openDesktopNav]);

  const toggleMobileNav = useCallback(() => {
    if (isOpen) {
      closeNav({ restoreTarget: mobileHamburgerRef.current });
      return;
    }

    openMobileNav();
  }, [closeNav, isOpen, openMobileNav]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && !isInContact) {
        setVisible(false);
        closeNav();
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [closeNav, isInContact]);

  // Lock body scroll when mobile menu is open (mobile only)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const updateOverflow = () => {
      document.body.style.overflow = isOpen && mq.matches ? "hidden" : "";
    };
    const handleViewportChange = () => {
      const restoreTarget = mq.matches
        ? mobileHamburgerRef.current
        : desktopHamburgerRef.current;

      closeNav({ restoreTarget });
      updateOverflow();
    };

    updateOverflow();
    mq.addEventListener("change", handleViewportChange);
    return () => {
      mq.removeEventListener("change", handleViewportChange);
      document.body.style.overflow = "";
    };
  }, [closeNav, isOpen]);

  useEffect(() => {
    let cancelled = false;

    const el = document.getElementById("hero");
    if (!el) {
      // Update state async to avoid synchronous setState warnings.
      Promise.resolve().then(() => {
        if (!cancelled) setIsInHero(false);
      });
      return () => {
        cancelled = true;
      };
    }

    // Hide the header "home/brand" while the hero section is visible.
    // rootMargin accounts for the fixed header height (h-18 ~= 72px).
    const observer = new IntersectionObserver(
      ([entry]) => setIsInHero(entry.isIntersecting),
      {
        root: null,
        threshold: 0,
        rootMargin: "-72px 0px 0px 0px",
      }
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    const el = document.getElementById("contact");
    if (!el) {
      Promise.resolve().then(() => {
        if (!cancelled) setIsInContact(false);
      });
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInContact(entry.isIntersecting);
      },
      { root: null, threshold: 0, rootMargin: "-72px 0px -100% 0px" }
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      const focusTarget =
        pendingOpenFocusRef.current === "mobile"
          ? getFirstFocusable(mobileNavRef.current)
          : pendingOpenFocusRef.current === "desktop"
            ? getFirstFocusable(desktopNavRef.current)
            : null;

      if (!focusTarget) return;

      const frame = window.requestAnimationFrame(() => {
        focusTarget.focus();
        pendingOpenFocusRef.current = null;
      });

      return () => window.cancelAnimationFrame(frame);
    }

    const restoreTarget = pendingRestoreFocusRef.current;
    if (!restoreTarget) return;

    const frame = window.requestAnimationFrame(() => {
      restoreTarget.focus();
      pendingRestoreFocusRef.current = null;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [getFirstFocusable, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const mq = window.matchMedia("(max-width: 767px)");
    if (!mq.matches) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeNav({ restoreTarget: mobileHamburgerRef.current });
        return;
      }

      if (event.key !== "Tab") return;

      const firstFocusable = getFirstFocusable(mobileNavRef.current);
      const lastFocusable = mobileCloseButtonRef.current;

      if (!firstFocusable || !lastFocusable) return;

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeNav, getFirstFocusable, isOpen]);

  return (
    <>
      <header
        className={`${isInContact ? "bg-transparent" : "bg-background"} fixed top-0 left-0 z-50 h-18 w-screen
          transition-transform duration-300 ease-in-out
          ${visible ? "translate-y-0" : "-translate-y-full"}
          ${isInContact ? "max-md:opacity-0 max-md:pointer-events-none" : ""}`}
      >
        <div className="flex items-center justify-between h-full px-6 md:px-16 py-4">
          {/* Home button / brand */}
          {isInHero ? (
            <span
              aria-hidden="true"
              tabIndex={-1}
              className="text-sora-24 font-extrabold tracking-tight text-foreground opacity-0"
            >
              {brandName}
            </span>
          ) : (
            <a
              href={brandHref}
              className="text-sora-24 font-extrabold tracking-tight text-foreground"
            >
              {brandName}
            </a>
          )}

          {/* Desktop nav */}
          <div className="hidden md:flex items-center">
            <div
              id="desktop-navigation"
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-w-[700px]" : "max-w-0"}`}
            >
              <nav
                ref={desktopNavRef}
                className={`flex items-center gap-4 pr-2 whitespace-nowrap transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
              >
                {navItems.map((item) => (
                  <Button key={item.href} href={item.href}>
                    {item.label}
                  </Button>
                ))}
                <ThemeToggle />
              </nav>
            </div>
            <HamburgerIcon
              isOpen={isOpen}
              onToggle={toggleDesktopNav}
              controlsId="desktop-navigation"
              buttonRef={desktopHamburgerRef}
            />
          </div>

          {/* Mobile: only hamburger */}
          <div className="flex md:hidden">
            <HamburgerIcon
              isOpen={isOpen}
              onToggle={toggleMobileNav}
              controlsId="mobile-navigation"
              buttonRef={mobileHamburgerRef}
            />
          </div>
        </div>
      </header>

      {/* Mobile full-screen slide-down menu */}
      <div
        aria-hidden={!isOpen || !visible}
        inert={!isOpen || !visible}
        className={`md:hidden fixed inset-0 z-40 bg-background flex flex-col
          transition-transform duration-500 ease-in-out
          ${isOpen && visible ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"}`}
      >
        {/* Top row mirrors the header while the close button stays last in tab order */}
        <div className="flex items-center justify-between h-18 px-6 py-4 shrink-0">
          {isInHero ? (
            <span
              aria-hidden="true"
              tabIndex={-1}
              className="text-sora-24 font-extrabold tracking-tight text-foreground opacity-0"
            >
              {brandName}
            </span>
          ) : (
            <a
              href={brandHref}
              onClick={() => closeNav({ restoreFocus: false })}
              tabIndex={-1}
              className="text-sora-24 font-extrabold tracking-tight text-foreground"
            >
              {brandName}
            </a>
          )}
        </div>

        {/* Nav links - vertical, staggered fade-in */}
        <nav
          id="mobile-navigation"
          ref={mobileNavRef}
          className="flex flex-col items-start justify-center flex-1 gap-6 px-6 pb-16"
        >
          {navItems.map((item, i) => (
            <div
              key={item.href}
              className={`transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: isOpen ? `${150 + i * 60}ms` : "0ms" }}
            >
              <Button href={item.href} onClick={() => closeNav({ restoreFocus: false })}>
                {item.label}
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

        <div className="absolute top-4 right-6">
          <HamburgerIcon
            isOpen={isOpen}
            onToggle={toggleMobileNav}
            controlsId="mobile-navigation"
            buttonRef={mobileCloseButtonRef}
          />
        </div>
      </div>
    </>
  );
}
