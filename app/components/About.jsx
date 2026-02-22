"use client";

import HorizontalLines from "./Lines";
import PillBadge from "./Pill";
import PrizeCategories from "./Categories";
import PhotoGallery from "./PhotoGallery";

export default function About() {
  return (
      <section
        id="about"
        className="relative min-h-screen flex flex-col items-center justify-start bg-[#151c43] text-white pb-[50vh]"
      >
        {/* ——— About banner ——— */}
        <div className="w-full py-8 px-6">
          <p className="text-lg leading-tight text-center max-w-5xl mx-auto mt-18 text-white">
            Welcome to Catapult: a 36-hour <b>AI + ML × Entrepreneurship</b> hackathon
            hosted by ML@Purdue. Whether you're a designer, hacker, founder, or
            researcher, Catapult is your launchpad to create, build, and share
            something extraordinary. No matter your experience level, this is your
            chance to collaborate, experiment, and make it happen. Ready to take
            the leap? <b>Join us and build something unforgettable.</b>
          </p>
        </div>

      {/* ——— Logistics ——— */}
      <div className="relative flex flex-col items-center justify-center max-w-4xl text-center z-10 w-full mt-2 mb-15">
        <div className="flex flex-row gap-10 items-center justify-center flex-wrap">
          <PillBadge text="April 3rd – 5th" width={360} height={140} />
          <PillBadge text="@ WALC" width={360} height={140} />
        </div>
        <a href="https://luma.com/mp8bovsd?utm_source=embed"
          style={{
            display: "inline-block",
            backgroundColor: "rgba(107, 229, 190, 0.08)",
            color: "#6be5be",
            margin: "30px",
            padding: "18px 40px",
            width: "80%",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            border: "1.5px solid #6be5be",
            borderRadius: "14px",
            cursor: "pointer",
            transition: "all 0.25s ease",
            boxShadow: "0 0 16px rgba(107, 229, 190, 0.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#6be5be";
            e.currentTarget.style.color = "#0a0a0a";
            e.currentTarget.style.boxShadow = "0 0 24px rgba(107, 229, 190, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(107, 229, 190, 0.08)";
            e.currentTarget.style.color = "#6be5be";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(107, 229, 190, 0.15)";
          }}
        >
          Register now!
        </a>
        {/* <div className="mt-16 relative flex flex-col items-center justify-center text-center z-10">
            <p className="text-xl w-[80%] leading-tight">
              <b>4 – 6 people per team.</b> Guaranteed prize awarded to all valid
              submissions to be claimed at the closing ceremony!
            </p>
          </div>*/}
      </div>

      {/* ——— Photo Gallery ——— */}
      <PhotoGallery />

      {/* ——— Categories ——— */}
      <div className="mt-6 relative flex flex-col items-center justify-center max-w-4xl text-center z-10 w-full">
        <h1 className="text-5xl -mb-17 font-semibold">Categories</h1>
        <PrizeCategories />
      </div>

      <HorizontalLines />
    </section>
  );
}
