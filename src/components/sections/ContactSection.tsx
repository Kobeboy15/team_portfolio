"use client"

import { Section } from "../ui/Section";
import { Button } from "../ui/Button";
import ContactForm from "../ui/ContactForm";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

import { contactData } from "../../data/contact";

export function ContactSection() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const { resolvedTheme } = useTheme();

    const invertClass = mounted && resolvedTheme === "dark" ? "invert" : "";

  return (
    <Section id="contact" className="bg-background-2 w-full flex flex-col">
        <div className="flex w-full flex-1 border-t border-current/20">
            <div className="flex flex-col w-2/5 border-r border-current/20 p-7 items-end">
                <h1 className="w-full text-header-1 tracking-display font-bebas whitespace-nowrap">{contactData.slogan}</h1>
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
            </div>

            <div className="w-3/5 flex flex-col py-3 px-15 gap-3">
                {/* Socials */}
                <div className="py-5 flex flex-col gap-5">
                    <h2 className="font-sora text-sora-18 opacity-70">Socials</h2>
                    <div className="flex gap-7">
                        {contactData.socials.map((social, i) => (
                            <a key={i} href={social.url} target="_blank" rel="noopener noreferrer">
                                <img src={social.icon} alt={social.name} className={`w-8 h-8 ${invertClass}`} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="py-5 flex flex-col gap-5">
                    <h2 className="font-sora text-sora-18 opacity-70">Contact</h2>
                    <ContactForm/>
                </div>
            </div>
        </div>

        {/* Footer Section */}
        <div className="border-t border-current/20 pr-8 w-full px-5 py-8">
            <div className="font-sora text-sora-18 opacity-50">{contactData.copyright}</div>
        </div>
    </Section>
  );
}
