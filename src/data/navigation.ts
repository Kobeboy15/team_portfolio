export type NavigationItem = {
  label: string;
  href: string;
};

export const navigationData = {
  brandName: "Kobe",
  brandHref: "#hero",
  navItems: [
    { label: "About", href: "#about" },
    { label: "Expertise", href: "#expertise" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ] satisfies NavigationItem[],
};
