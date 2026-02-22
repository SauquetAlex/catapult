"use client";

import { useState, useRef, useCallback } from "react";

import TrophyIcon from "../icons/trophy.svg";
import RocketIcon from "../icons/rocket.svg";
import BrainIcon from "../icons/brain.svg";
import GlobeIcon from "../icons/globe.svg";
import RobotIcon from "../icons/robot.svg";
import DollarIcon from "../icons/dollar.svg";

import Image from "next/image";

// ─── Spotlight Card ───────────────────────────────────────────────
function SpotlightCard({
  children,
  spotlightColor = "rgba(61,191,154,0.25)",
  className = "",
  style = {},
  onMouseEnter,
  onMouseLeave,
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const handleEnter = useCallback(
    (e) => {
      setOpacity(1);
      onMouseEnter?.(e);
    },
    [onMouseEnter],
  );

  const handleLeave = useCallback(
    (e) => {
      setOpacity(0);
      onMouseLeave?.(e);
    },
    [onMouseLeave],
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        ...style,
      }}
      className={className}
    >
      {/* Spotlight glow layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity,
          transition: "opacity 0.35s ease",
          background: `radial-gradient(circle 220px at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 100%)`,
          zIndex: 1,
        }}
      />
      {/* Border glow layer — follows the cursor along the edge */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity,
          transition: "opacity 0.35s ease",
          borderRadius: "inherit",
          background: `radial-gradient(circle 180px at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 100%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
          zIndex: 3,
        }}
      />
      <div style={{ position: "relative", zIndex: 2 }}>{children}</div>
    </div>
  );
}

// ─── Category data ────────────────────────────────────────────────
const categories = [
  {
    title: "Overall Winner",
    desc: "Awarded to the team with the most outstanding project, considering innovation, execution, and impact.",
    Icon: TrophyIcon,
  },
  {
    title: "Best ML Project",
    desc: "Outstanding project built around a trained machine learning model.",
    Icon: BrainIcon,
  },
  {
    title: "Most Promising Startup",
    desc: "Project with the strongest potential for real world impact, scalability, or business viability.",
    Icon: RocketIcon,
  },
  {
    title: "Best Automation",
    desc: "Project that best streamlines a manual or repetitive process through clever automation.",
    Icon: GlobeIcon,
  },
  {
    title: "Best Use of Hardware",
    desc: "Project that best incorporates AI with physical devices, robotics, sensors, or other hardware.",
    Icon: RobotIcon,
  },
  {
    title: "Most Promising FinTech",
    desc: "Most innovative application of technology to solve a real problem in finance or payments.",
    Icon: DollarIcon,
  },
];

// ─── Main component ───────────────────────────────────────────────
export default function PrizeCategories() {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        width: "100%",
        padding: "48px 24px",
        display: "flex",
        justifyContent: "center",
        marginTop: "46px",
        // marginBottom: "340px"
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "30px",
          width: "100%",
          maxWidth: "95%",
        }}
      >
        {categories.map((cat, i) => {
          const isHovered = hovered === i;
          return (
            <SpotlightCard
              key={i}
              spotlightColor="rgba(61,191,154,0.22)"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: "32px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${isHovered ? "rgba(61,191,154,0.45)" : "rgba(255,255,255,0.08)"}`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                transition: "border-color 0.35s ease, background 0.35s ease",
                cursor: "default",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  textAlign: "left",
                }}
              >
                {/* Icon */}
                <Image
                  src={cat.Icon.src}
                  width={42}
                  height={42}
                  alt=""
                  style={{
                    filter: isHovered
                      ? "brightness(0) saturate(100%) invert(68%) sepia(52%) saturate(397%) hue-rotate(111deg) brightness(92%) contrast(89%)"
                      : "brightness(0) invert(1)",
                    transition: "filter 0.35s ease",
                  }}
                />

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--font-unbounded), sans-serif",
                    fontSize: "22px",
                    fontWeight: 500,
                    color: "#fff",
                    lineHeight: 1.3,
                    marginTop: "16px",
                  }}
                >
                  {cat.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-raleway), sans-serif",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.6,
                    marginTop: "8px",
                  }}
                >
                  {cat.desc}
                </p>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
}
