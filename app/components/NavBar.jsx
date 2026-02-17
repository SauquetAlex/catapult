'use client';

import Image from "next/image"
import Link from "next/link";

const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

const navItems = [
    { label: "HOME", section: "home" },
    { label: "ABOUT", section: "about" },
    { label: "SCHEDULE", section: "schedule" },
    { label: "FAQS", section: "faq" },
    { label: "SPONSORS", section: "sponsors" },
];

export default function NavBar() {
    return (
        <nav className="sticky top-0 flex justify-between items-center z-50 py-3 bg-gradient-to-b from-[#151c43] to-[#151c43]/60 backdrop-blur-lg">
            <div>
                <Image
                    className="ml-2"
                    src="/TA.png"
                    alt="Catapult Logo"
                    width={60}
                    height={60}
                />
            </div>
            <div className="flex items-center gap-5.5 text-lg text-white mr-7 z-20">
                {navItems.map((item) => (
                    <button
                        key={item.section}
                        onClick={() => scrollToSection(item.section)}
                        className="relative px-6 py-1.5 cursor-pointer backdrop-blur-md bg-[#6be5be]/25 border border-[#6be5be]/45 rounded-[50%] transition-all duration-300 ease-out hover:bg-[#6be5be]/40 hover:border-[#6be5be]/65 hover:shadow-[0_8px_32px_rgba(107,229,190,0.25)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className="relative z-10 tracking-wide text-sm font-medium">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    )
}