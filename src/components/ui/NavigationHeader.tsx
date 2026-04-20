"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Button } from "./Button";
import { ThemeToggle } from "./ThemeToggle";
import { HamburgerIcon } from "./HamburgerIcon";

const MOBILE_MENU_ID = "mobile-navigation-menu";
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => {
      if (element.hasAttribute("disabled")) return false;
      if (element.getAttribute("aria-hidden") === "true") return false;
      if (element.closest("[inert]")) return false;

      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden";
    }
  );
}

export function NavigationHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isInHero, setIsInHero] = useState(false);
  const [isInContact, setIsInContact] = useState(false);

  const lastScrollY = useRef(0);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const pathname = usePathname();

  const closeMobileMenu = (restoreFocus = true) => {
    shouldRestoreFocusRef.current = restoreFocus;
    setIsOpen(false);
  };

  const toggleMobileMenu = () => {
    if (!isOpen) {
      restoreFocusRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : mobileTriggerRef.current;
      shouldRestoreFocusRef.current = true;
      setIsOpen(true);
      return;
    }

    closeMobileMenu(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && !isInContact) {
        setVisible(false);
        if (isOpen) {
          closeMobileMenu(true);
        }
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isInContact, isOpen]);

  // Lock body scroll when mobile menu is open (mobile only)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const updateOverflow = () => {
      document.body.style.overflow = isOpen && mq.matches ? "hidden" : "";
    };
    const handleViewportChange = () => {
      if (isOpen) {
        closeMobileMenu(false);
      }
      updateOverflow();
    };
    updateOverflow();
    mq.addEventListener("change", handleViewportChange);
    return () => {
      mq.removeEventListener("change", handleViewportChange);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      if (shouldRestoreFocusRef.current) {
        const target = restoreFocusRef.current;
        if (target && document.contains(target)) {
          target.focus();
        }
      }

      shouldRestoreFocusRef.current = false;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const focusable = getFocusableElements(mobileMenuRef.current);
      const firstTarget = focusable[0] ?? mobileCloseButtonRef.current;
      firstTarget?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu(true);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(mobileMenuRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        mobileCloseButtonRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === first || !mobileMenuRef.current?.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;

    const el = document.getElementById("hero");
    if (!el) {
      Promise.resolve().then(() => {
        if (!cancelled) setIsInHero(false);
      });
      return () => {
        cancelled = true;
      };
    }

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

  const navItems = ["About", "Expertise", "Projects", "Contact"];

  return (
    <>
      <header
        className={`${isInContact ? "bg-transparent" : "bg-background"} fixed top-0 left-0 z-50 h-18 w-screen
          transition-transform duration-300 ease-in-out
          ${visible ? "translate-y-0" : "-translate-y-full"}
          ${isInContact ? "max-md:opacity-0 max-md:pointer-events-none" : ""}`}
      >
        <div className="flex items-center justify-between h-full px-6 py-4 md:px-16">
          {isInHero ? (
            <span
              aria-hidden="true"
              tabIndex={-1}
              className="text-sora-24 font-extrabold tracking-tight text-foreground opacity-0"
            >
              Kobe
            </span>
          ) : (
            <a href="#hero" className="text-sora-24 font-extrabold tracking-tight text-foreground">
              Kobe
            </a>
          )}

          <div className="hidden items-center md:flex">
            <div
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-w-[700px]" : "max-w-0"}`}
            >
              <nav
                className={`flex items-center gap-4 whitespace-nowrap pr-2 transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
              >
                {navItems.map((item) => (
                  <Button key={item} href={`#${item.toLowerCase()}`}>
                    {item}
                  </Button>
                ))}
                <ThemeToggle />
              </nav>
            </div>
            <HamburgerIcon isOpen={isOpen} onToggle={toggleMobileMenu} />
          </div>

          <div className="flex md:hidden">
            <HamburgerIcon
              isOpen={isOpen}
              onToggle={toggleMobileMenu}
              controlsId={MOBILE_MENU_ID}
              buttonRef={mobileTriggerRef}
            />
          </div>
        </div>
      </header>

      <div
        id={MOBILE_MENU_ID}
        ref={mobileMenuRef}
        aria-hidden={!isOpen || !visible}
        inert={!isOpen || !visible}
        className={`fixed inset-0 z-40 flex flex-col bg-background transition-transform duration-500 ease-in-out md:hidden
          ${isOpen && visible ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"}`}
      >
        <div className="flex h-18 shrink-0 items-center justify-between px-6 py-4">
          {isInHero ? (
            <span
              aria-hidden="true"
              tabIndex={-1}
              className="text-sora-24 font-extrabold tracking-tight text-foreground opacity-0"
            >
              Kobe
            </span>
          ) : (
            <a
              href="#hero"
              onClick={() => closeMobileMenu(true)}
              className="text-sora-24 font-extrabold tracking-tight text-foreground"
            >
              Kobe
            </a>
          )}
          <HamburgerIcon
            isOpen={isOpen}
            onToggle={toggleMobileMenu}
            controlsId={MOBILE_MENU_ID}
            buttonRef={mobileCloseButtonRef}
          />
        </div>

        <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-6 pb-16">
          {navItems.map((item, i) => (
            <div
              key={item}
              className={`transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: isOpen ? `${150 + i * 60}ms` : "0ms" }}
            >
              <Button href={`#${item.toLowerCase()}`} onClick={() => closeMobileMenu(true)}>
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
