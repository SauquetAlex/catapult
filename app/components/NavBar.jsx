"use client";
import { useState } from "react";
import Image from "next/image";

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const navItems = [
  { label: "HOME", section: "home" },
  { label: "ABOUT", section: "about" },
  { label: "SCHEDULE", section: "schedule" },
  { label: "FAQS", section: "faq" },
  { label: "SPONSORS", section: "sponsors" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const handleClick = (section) => {
    scrollToSection(section);
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#151c43] to-[#151c43]/60 backdrop-blur-lg">
      <div className="flex justify-between items-center py-3 px-2">
        <Image src="/ta.png" alt="Catapult Logo" width={60} height={60} />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5.5 text-lg text-white mr-7">
          {navItems.map((item) => (
            <button
              key={item.section}
              onClick={() => scrollToSection(item.section)}
              className="relative px-6 py-1.5 cursor-pointer backdrop-blur-md bg-[#6be5be]/25 border border-[#6be5be]/45 rounded-full transition-all duration-300 ease-out hover:bg-[#6be5be]/40 hover:border-[#6be5be]/65 hover:shadow-[0_8px_32px_rgba(107,229,190,0.25)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="relative z-10 tracking-wide text-sm font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white mr-4 text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden flex flex-col items-center gap-3 pb-4">
          {navItems.map((item) => (
            <button
              key={item.section}
              onClick={() => handleClick(item.section)}
              className="px-6 py-2 text-sm font-medium text-white backdrop-blur-md bg-[#6be5be]/25 border border-[#6be5be]/45 rounded-full"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
