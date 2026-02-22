"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import RippleBackground from "./Circles";

const sponsors = [
  { name: "Benevity", logo: "/Sponsors/ben.png", url: "https://benevity.com/" },
  { name: "DataBricks", logo: "/Sponsors/databricks.svg", url: "https://www.databricks.com/" },
  { name: "Jane Street", logo: "/Sponsors/janestreet.png", url: "https://www.janestreet.com/" },
  { name: "Mad Mushroom", logo: "/Sponsors/Mad_Mushroom_Dark.png", url: "https://www.madmushroom.com/west-lafayette" },
  { name: "Modal", logo: "/Sponsors/modal.png", url: "https://modal.com/" },
  { name: "Purdue CS", logo: "/Sponsors/CompSci_H-Full-RGB.svg", url: "https://www.cs.purdue.edu/" },
  { name: "Purdue Innovates", logo: "/Sponsors/purdueInnovates-Black-cropped.png", url: "https://purdueinnovates.org/" },
  { name: "Purdue Rosen Center for Advanced Computing", logo: "/Sponsors/RCAC_H-Full-RGB_1.svg", url: "https://www.rcac.purdue.edu/" },
  { name: "Ripple", logo: "/Sponsors/ripplelogo.svg", url: "https://ripple.com/" },
  { name: "Snowflake", logo: "/Sponsors/snowflake.svg", url: "https://www.snowflake.com/" },
  { name: "TE Connectivity", logo: "/Sponsors/tecon.webp", url: "https://www.te.com/" },
  { name: "Wolfram", logo: "/Sponsors/wolfram.png", url: "https://www.wolfram.com/" },
];

export default function Sponsors() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sponsors"
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
    >
      <RippleBackground />

      <div className="relative z-10 w-full max-w-6xl px-6 py-12 md:py-28">
        <div
          className="text-center mb-10 md:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <h2
            className="text-5xl mt-3 md:text-6xl text-[#151c43] tracking-tight"
            style={{ fontFamily: "var(--font-unbounded), sans-serif" }}
          >
            Sponsors & Partners
          </h2>
          <p className="mt-3 text-[#151c43]/60 max-w-md mx-auto">
            Backed by teams who believe in builders and innovators.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-8 md:-mt-5">
          {sponsors.map((sponsor, i) => (
            <a
              key={sponsor.name}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center h-22 rounded-2xl bg-white/10 backdrop-blur-md border border-[#151c43]/15 text-[#151c43] font-semibold tracking-wide text-xl hover:scale-105 hover:bg-white/20 hover:shadow-[0_10px_40px_rgba(21,28,67,0.15)] transition-all duration-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.6s ease ${i * 70}ms, transform 0.6s ease ${i * 70}ms`,
              }}
            >
              {sponsor.logo ? (
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={200}
                  height={75}
                  className="max-h-12 object-contain"
                />
              ) : (
                sponsor.name
              )}
            </a>
          ))}
        </div>

        <div
          className="mt-10 md:mt-13 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 600ms",
          }}
        >
          <a
            href="mailto:aiml@purdue.edu"
            className="inline-block px-10 py-4 rounded-full bg-[#151c43] text-[#6be5be] font-bold tracking-widest uppercase text-sm hover:bg-[#151c43]/85 transition-colors duration-300"
          >
            Become a Sponsor
          </a>
        </div>
      </div>
    </section>
  );
}
