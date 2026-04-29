"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import { ScrollReveal } from "../ui/ScrollReveal";
import ContactForm from "../ui/ContactForm";
import { useNativeScrollZone } from "../ui/SmoothScrollProvider";

import { useTheme } from "next-themes";

import { useClientMounted } from "@/src/hooks/useClientMounted";
import { contactData } from "../../data/contact";

export function ContactSection() {
    const mounted = useClientMounted();

    const { resolvedTheme } = useTheme();

    const invertClass = mounted && resolvedTheme === "dark" ? "invert" : "";

    const desktopPaneRef = useRef<HTMLDivElement | null>(null);
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(min-width: 768px)").matches;
    });
    const [isInteractingWithDesktopPane, setIsInteractingWithDesktopPane] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const mql = window.matchMedia("(min-width: 768px)");
        const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

        mql.addEventListener("change", onChange);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    const onDesktopPaneBlurCapture = useCallback(
        (event: React.FocusEvent<HTMLDivElement>) => {
            const next = event.relatedTarget;
            if (!(next instanceof Node)) {
                setIsInteractingWithDesktopPane(false);
                return;
            }

            const el = desktopPaneRef.current;
            if (!el || !el.contains(next)) {
                setIsInteractingWithDesktopPane(false);
            }
        },
        [],
    );

    const nativeZoneDefinition = useMemo(
        () => ({
            isActive: () => {
                if (!isDesktop) return false;
                if (!isInteractingWithDesktopPane) return false;

                const el = desktopPaneRef.current;
                if (!el) return false;

                return el.scrollHeight > el.clientHeight + 1;
            },
        }),
        [isDesktop, isInteractingWithDesktopPane],
    );

    useNativeScrollZone("contact-right-pane", nativeZoneDefinition);

  return (
    <Section id="contact" className="bg-background-2 min-h-0 w-full flex flex-col md:h-dvh">
        <div className="flex flex-col md:flex-row w-full flex-1 border-t border-current/20 md:min-h-0">
            <div className="flex flex-col w-full md:w-2/5 border-b md:border-b-0 md:border-r border-current/20 p-7 items-end">
                <ScrollReveal className="w-full">
                    <h2 className="w-full text-header-1 tracking-display font-bebas whitespace-nowrap">{contactData.slogan}</h2>
                </ScrollReveal>
                <ScrollReveal delay={0.1}>
                    <Button
                        href="#hero"
                        icon={
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 13 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M6.5 11.25V1.75M1.75 6.5L6.5 1.75L11.25 6.5"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        </svg>
                        }
                    >
                        Back to top
                    </Button>
                </ScrollReveal>
            </div>

            <div
                ref={desktopPaneRef}
                onPointerEnter={() => setIsInteractingWithDesktopPane(true)}
                onPointerLeave={() => setIsInteractingWithDesktopPane(false)}
                onFocusCapture={() => setIsInteractingWithDesktopPane(true)}
                onBlurCapture={onDesktopPaneBlurCapture}
                className="w-full md:w-3/5 flex flex-col py-3 px-7 md:px-15 gap-3 2xl:gap-5 md:flex-1 md:min-h-0 md:overflow-y-auto"
            >
                {/* Socials */}
                <div className="py-5 flex flex-col gap-5">
                    <h2 className="font-sora text-sora-18 opacity-70">Socials</h2>
                    <div className="flex gap-7">
                        {contactData.socials.map((social, i) => (
                            <ScrollReveal key={i} delay={i * 0.06}>
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                >
                                    <img src={social.icon} alt="" aria-hidden="true" className={`w-8 h-8 ${invertClass}`} />
                                </a>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="py-5 flex flex-col gap-5 md:flex-1 md:min-h-0">
                    <h2 className="font-sora text-sora-18 opacity-70">Contact</h2>
                    <div className="md:flex-1 md:min-h-0">
                        <ScrollReveal>
                            <ContactForm />
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Section */}
        <div className="border-t border-current/20 pr-8 w-full px-5 py-3 md:py-8">
            <div className="font-sora text-sora-13 md:text-sora-18 opacity-50">{contactData.copyright}</div>
        </div>
    </Section>
  );
}
