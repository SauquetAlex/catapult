"use client";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full py-3 bg-[#151c43] border-t border-[#6be5be]/20 text-center">
      <a
        href="https://mlpurdue.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#6be5be]/80 hover:text-[#6be5be] transition-colors duration-300 text-xl tracking-wide"
      >
        Made with <span className="text-red-400">{"\u2665"}</span> by ML@Purdue
      </a>
    </footer>
  );
}
