type HamburgerIconProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function HamburgerIcon({ isOpen, onToggle }: HamburgerIconProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="relative flex items-center justify-center w-9 h-9 cursor-pointer transition-all duration-200"
    >
      <div className="flex flex-col justify-between w-5 h-5 overflow-hidden relative">
        <div
          className={`bg-foreground h-[2px] w-5 transition-all duration-300 origin-left ${
            isOpen ? "translate-x-10" : ""
          }`}
        />
        <div
          className={`bg-foreground h-[2px] w-5 rounded transition-all duration-300 delay-75 ${
            isOpen ? "translate-x-10" : ""
          }`}
        />
        <div
          className={`bg-foreground h-[2px] w-4 transition-all duration-300 origin-left delay-150 ${
            isOpen ? "translate-x-10" : ""
          }`}
        />

        <div
          className={`absolute top-2.5 flex items-center justify-between transition-all duration-500 ${
            isOpen ? "translate-x-0 w-12" : "-translate-x-10 w-0"
          }`}
        >
          <div
            className={`absolute bg-foreground h-[2px] w-5 transition-all duration-500 delay-300 ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
          />
          <div
            className={`absolute bg-foreground h-[2px] w-5 transition-all duration-500 delay-300 ${
              isOpen ? "-rotate-45" : "rotate-0"
            }`}
          />
        </div>
      </div>
    </button>
  );
}

