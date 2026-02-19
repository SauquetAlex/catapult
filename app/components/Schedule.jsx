"use client";

import { useState, useEffect, useRef } from "react";

// Grid color: rgba(0, 215, 185, ...) — deep saturated teal, more vibrant than the minty #6be5be
// Card accents stay as #6be5be — reads as a lighter highlight on top, no clash

function SpiralLines({ mouseRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = canvas.parentElement.offsetWidth;
    let height = canvas.parentElement.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let animId;
    let time = 0;

    const mouse = mouseRef.current;
    const distortRadius = 400;
    const distortStrength = 70;

    function distort(px, py) {
      const dx = px - mouse.x;
      const dy = py - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist > distortRadius || dist < 1) return { x: px, y: py };
      const factor = 1 - dist / distortRadius;
      const power = factor * factor * distortStrength;
      return {
        x: px + (dx / dist) * power,
        y: py + (dy / dist) * power,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      time += 0.003;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mActive = mouseRef.current.active;
      mouse.x = mx;
      mouse.y = my;
      mouse.active = mActive;

      // ── ANIMATED GRID ──
      const gridSpacing = 35;
      const cols = Math.ceil(width / gridSpacing) + 1;
      const rows = Math.ceil(height / gridSpacing) + 1;

      // Vertical grid lines — vibrant deep teal, boosted opacity
      for (let c = 0; c < cols; c++) {
        const x = c * gridSpacing;
        const distFromCenter = Math.abs(x - width / 2) / (width / 2);
        const pulse = Math.sin(time * 1.2 + c * 0.3) * 0.5 + 0.5;
        const opacity = (0.18 + pulse * 0.12) * (1 - distFromCenter * 0.5);

        ctx.beginPath();
        const step = 8;
        for (let py = 0; py <= height; py += step) {
          const p = distort(x, py);
          if (py === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(0, 215, 185, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Horizontal grid lines — vibrant deep teal
      for (let r = 0; r < rows; r++) {
        const y = r * gridSpacing;
        const distFromCenter = Math.abs(y - height / 2) / (height / 2);
        const pulse = Math.sin(time * 1.5 + r * 0.25) * 0.5 + 0.5;
        const opacity = (0.18 + pulse * 0.12) * (1 - distFromCenter * 0.4);

        ctx.beginPath();
        const step = 8;
        for (let px = 0; px <= width; px += step) {
          const p = distort(px, y);
          if (px === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(0, 215, 185, ${opacity})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // ── CURSOR GLOW ──
      if (mouse.active) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          distortRadius,
        );
        glowGrad.addColorStop(0, "rgba(0, 215, 185, 0.10)");
        glowGrad.addColorStop(0.5, "rgba(0, 215, 185, 0.04)");
        glowGrad.addColorStop(1, "rgba(0, 215, 185, 0)");
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, distortRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      // ── SCANNING LINES ──
      const scanCount = 3;
      for (let s = 0; s < scanCount; s++) {
        const scanY =
          ((time * 80 + s * (height / scanCount)) % (height + 40)) - 20;
        const scanOpacity = 0.1;
        const grad = ctx.createLinearGradient(0, scanY - 1, 0, scanY + 1);
        grad.addColorStop(0, `rgba(0, 215, 185, 0)`);
        grad.addColorStop(0.5, `rgba(0, 215, 185, ${scanOpacity})`);
        grad.addColorStop(1, `rgba(0, 215, 185, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 15, width, 30);
      }

      // ── DIAGONAL ACCENT LINES ──
      const numDiags = 8;
      for (let d = 0; d < numDiags; d++) {
        const offset = (d / numDiags) * (width + height);
        const animOffset = Math.sin(time + d * 0.7) * 30;
        const opacity = 0.04 + Math.sin(time * 1.8 + d) * 0.02;

        ctx.beginPath();
        const diagStep = 12;
        for (let t2 = 0; t2 <= 1; t2 += diagStep / Math.hypot(width, height)) {
          const px = offset + animOffset - height + t2 * height;
          const py = t2 * height;
          const p = distort(px, py);
          if (t2 === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(0, 215, 185, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // ── CORNER BRACKETS ──
      const bracketSize = 60;
      const bracketWeight = 1;
      const bracketOpacity = 0.22 + Math.sin(time * 2) * 0.06;
      ctx.strokeStyle = `rgba(0, 215, 185, ${bracketOpacity})`;
      ctx.lineWidth = bracketWeight;

      ctx.beginPath();
      ctx.moveTo(20, 20 + bracketSize);
      ctx.lineTo(20, 20);
      ctx.lineTo(20 + bracketSize, 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - 20 - bracketSize, 20);
      ctx.lineTo(width - 20, 20);
      ctx.lineTo(width - 20, 20 + bracketSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(20, height - 20 - bracketSize);
      ctx.lineTo(20, height - 20);
      ctx.lineTo(20 + bracketSize, height - 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - 20 - bracketSize, height - 20);
      ctx.lineTo(width - 20, height - 20);
      ctx.lineTo(width - 20, height - 20 - bracketSize);
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}

const scheduleData = [
  {
    day: "Friday, April 3",
    events: [
      {
        time: "8:00 PM",
        title: "Check-In & Registration",
        description: "Arrive, get your badge, and settle in.",
      },
      {
        time: "9:00 PM",
        title: "Opening Ceremony",
        description: "Kickoff, rules, and theme reveal.",
      },
      {
        time: "10:00 PM",
        title: "Team Formation",
        description: "Find teammates and brainstorm ideas.",
      },
      {
        time: "10:00 PM",
        title: "Start Hacking!",
        description: "The clock starts — begin building your project.",
      },
      {
        time: "11:30 PM",
        title: "Late Night Snacks",
        description: "Fuel up with snacks and drinks.",
      },
    ],
  },
  {
    day: "Saturday, April 4",
    events: [
      {
        time: "8:00 AM",
        title: "Breakfast",
        description: "Start the day with a full breakfast spread.",
      },
      {
        time: "9:00 AM",
        title: "Workshop: Intro to APIs",
        description: "Learn how to integrate APIs into your project.",
      },
      {
        time: "10:30 AM",
        title: "Workshop: UI/UX Design",
        description: "Tips for building a polished frontend.",
      },
      {
        time: "12:00 PM",
        title: "Lunch",
        description: "Take a break and refuel.",
      },
      {
        time: "1:00 PM",
        title: "Workshop: Cloud Deployment",
        description: "Deploy your app to the cloud in minutes.",
      },
      {
        time: "2:30 PM",
        title: "Mentor Office Hours",
        description: "Get 1-on-1 help from industry mentors.",
      },
      {
        time: "4:00 PM",
        title: "Workshop: AI/ML Crash Course",
        description: "Add intelligence to your hack with ML.",
      },
      {
        time: "6:00 PM",
        title: "Dinner",
        description: "Dinner is served — keep those energy levels up.",
      },
      {
        time: "7:00 PM",
        title: "Lightning Talks",
        description: "Quick tech talks from sponsors and mentors.",
      },
      {
        time: "10:00 PM",
        title: "Late Night Activities",
        description: "Games, trivia, and more to keep you going.",
      },
    ],
  },
  {
    day: "Sunday, April 5",
    events: [
      { time: "8:00 AM", title: "Breakfast", description: "Last day fuel-up." },
      {
        time: "9:00 AM",
        title: "Final Push",
        description: "Polish your project and prepare your demo.",
      },
      {
        time: "10:00 AM",
        title: "Hacking Ends — Code Freeze",
        description: "Submit your project on Devpost.",
      },
      {
        time: "10:00 AM",
        title: "Judging Begins",
        description:
          "Judges will start watching the videos you submitted. It's time for you to relax.",
      },
      {
        time: "12:00 PM",
        title: "Lunch",
        description: "Eat while judges deliberate.",
      },
      {
        time: "1:00 PM",
        title: "Closing Ceremony & Awards",
        description: "Winners announced, prizes awarded.",
      },
      {
        time: "2:00 PM",
        title: "Event Ends",
        description: "Thanks for hacking with us!",
      },
    ],
  },
];

export default function Schedule() {
  const [activeDay, setActiveDay] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  };

  return (
    <section
      ref={sectionRef}
      id="schedule"
      className="relative py-24 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <SpiralLines mouseRef={mouseRef} />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight">
            Event Schedule
          </h2>
          <p className="mt-4 text-[#fff] text-lg max-w-xl mx-auto">
            36 hours of hacking, workshops, and fun. Please know that the
            schedule may change. Participants will be made aware of such
            changes.
          </p>
          <div className="mt-4 mx-auto w-24 h-1 rounded-full bg-gradient-to-r from-[#6be5be] to-[#6be5be]/30" />
        </div>

        <div
          className={`flex justify-center gap-3 mb-12 flex-wrap transition-all duration-700 ease-out delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {scheduleData.map((dayData, index) => (
            <button
              key={dayData.day}
              onClick={() => setActiveDay(index)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide cursor-pointer border transition-all duration-300 ease-in-out ${activeDay === index ? "bg-[#6be5be]/20 border-[#6be5be]/70 text-[#6be5be] shadow-[0_0_14px_rgba(107,229,190,0.3)]" : "bg-transparent border-white/15 text-white/50 hover:border-white/30 hover:text-white/70"}`}
            >
              {dayData.day}
            </button>
          ))}
        </div>

        <div className="relative">
          <div
            className={`absolute left-[22px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6be5be]/40 via-[#6be5be]/20 to-transparent transition-all duration-1000 ease-out delay-300 origin-top ${visible ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}`}
          />

          <div className="space-y-8">
            {scheduleData[activeDay].events.map((event, index) => {
              const isLeft = index % 2 === 0;
              const delay = 400 + index * 100;
              return (
                <div
                  key={`${activeDay}-${index}`}
                  className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} transition-all duration-600 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
                >
                  <div className="absolute left-[18px] md:left-1/2 md:-translate-x-1/2 top-1 z-10">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#6be5be] shadow-[0_0_8px_rgba(107,229,190,0.6)]" />
                  </div>

                  <div
                    className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-4 md:text-right" : "md:pl-4 md:text-left"} group`}
                  >
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-[#6be5be]/[0.05] hover:border-[#6be5be]/20 hover:shadow-[0_0_20px_rgba(107,229,190,0.08)]">
                      <span className="inline-block px-3 py-1 mb-2 rounded-full text-xs font-semibold tracking-wider bg-[#6be5be]/10 text-[#fff] border border-[#6be5be]/20">
                        {event.time}
                      </span>
                      <h3 className="text-white text-lg leading-snug font-[family-name:var(--font-unbounded)]">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-white/40 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
