"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const photos = [
  "/Photos/DSCN8073.JPG",
  "/Photos/DSCN8076.JPG",
  "/Photos/DSCN8077.JPG",
  "/Photos/DSCN8078.JPG",
  "/Photos/DSCN8080.JPG",
  "/Photos/DSCN8081.JPG",
  "/Photos/DSCN8082.JPG",
  "/Photos/DSCN8083.JPG",
  "/Photos/DSCN8084.JPG",
  "/Photos/DSCN8090.JPG",
  "/Photos/DSCN8091.JPG",
  "/Photos/DSCN8094.JPG",
];

// duplicate the list so the scroll loop feels seamless
const loopedPhotos = [...photos, ...photos];

export default function PhotoGallery() {
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative w-full py-20 overflow-hidden"
    >
      {/* teal decorative accents */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #6be5be, transparent)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #6be5be, transparent)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />

      {/* floating teal orbs */}
      <div
        className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(107,229,190,0.15), transparent 70%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      />
      <div
        className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(107,229,190,0.12), transparent 70%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1.2s ease 0.2s",
        }}
      />

      {/* small teal diamonds scattered */}
      <div
        className="absolute top-6 left-[15%] w-2 h-2 rotate-45 bg-[#6be5be]/30 pointer-events-none"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.4s" }}
      />
      <div
        className="absolute top-10 right-[20%] w-1.5 h-1.5 rotate-45 bg-[#6be5be]/20 pointer-events-none"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.6s" }}
      />
      <div
        className="absolute bottom-8 left-[30%] w-1.5 h-1.5 rotate-45 bg-[#6be5be]/25 pointer-events-none"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.5s" }}
      />
      <div
        className="absolute bottom-6 right-[12%] w-2 h-2 rotate-45 bg-[#6be5be]/20 pointer-events-none"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1s ease 0.7s" }}
      />

      {/* scrolling track */}
      <div
        className="relative w-full"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      >
        {/* gradient fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-[#151c43] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-[#151c43] to-transparent" />

        <div
          ref={trackRef}
          className="flex gap-6 animate-scroll-left"
          style={{ width: "max-content" }}
        >
          {loopedPhotos.map((src, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-[320px] h-[220px] rounded-2xl overflow-hidden
                         border border-[#6be5be]/15 shadow-lg hover:shadow-[0_0_20px_rgba(107,229,190,0.2)] hover:scale-105 transition-all duration-300"
            >
              <Image
                src={src}
                alt={`Event photo ${(i % photos.length) + 1}`}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
