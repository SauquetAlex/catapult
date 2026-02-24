"use client";

import { useState, useEffect, useRef } from "react";

import Image from "next/image";

function CurvedLines() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = canvas.parentElement.offsetWidth;
    let height = canvas.parentElement.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    let animId;
    let time = 0;

    const curves = [
      {
        startY: 0.1,
        amplitude: 80,
        frequency: 1.2,
        speed: 0.008,
        opacity: 0.06,
        lineWidth: 2,
      },
      {
        startY: 0.25,
        amplitude: 60,
        frequency: 1.8,
        speed: -0.006,
        opacity: 0.04,
        lineWidth: 1.5,
      },
      {
        startY: 0.45,
        amplitude: 100,
        frequency: 0.8,
        speed: 0.01,
        opacity: 0.05,
        lineWidth: 2.5,
      },
      {
        startY: 0.6,
        amplitude: 50,
        frequency: 2.2,
        speed: -0.007,
        opacity: 0.03,
        lineWidth: 1,
      },
      {
        startY: 0.75,
        amplitude: 70,
        frequency: 1.5,
        speed: 0.009,
        opacity: 0.05,
        lineWidth: 1.8,
      },
      {
        startY: 0.9,
        amplitude: 90,
        frequency: 1.0,
        speed: -0.005,
        opacity: 0.04,
        lineWidth: 2,
      },
    ];

    function draw() {
      ctx.clearRect(0, 0, width, height);
      time += 1;

      for (const curve of curves) {
        ctx.beginPath();
        const baseY = curve.startY * height;
        for (let x = -20; x <= width + 20; x += 3) {
          const normalX = x / width;
          const y =
            baseY +
            Math.sin(normalX * Math.PI * curve.frequency + time * curve.speed) *
              curve.amplitude +
            Math.sin(
              normalX * Math.PI * curve.frequency * 2.3 -
                time * curve.speed * 0.7,
            ) *
              (curve.amplitude * 0.3);
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(21, 28, 67, ${curve.opacity})`;
        ctx.lineWidth = curve.lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // Decorative arcs in corners
      const arcOpacity = 0.04 + Math.sin(time * 0.005) * 0.01;
      ctx.beginPath();
      ctx.arc(-30, -30, 200 + Math.sin(time * 0.008) * 10, 0, Math.PI * 0.5);
      ctx.strokeStyle = `rgba(21, 28, 67, ${arcOpacity})`;
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(
        width + 30,
        height + 30,
        180 + Math.sin(time * 0.006 + 1) * 15,
        Math.PI,
        Math.PI * 1.5,
      );
      ctx.strokeStyle = `rgba(21, 28, 67, ${arcOpacity})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(
        width + 50,
        -50,
        250 + Math.sin(time * 0.007 + 2) * 12,
        Math.PI * 0.5,
        Math.PI,
      );
      ctx.strokeStyle = `rgba(21, 28, 67, ${arcOpacity * 0.7})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}

const faqData = [
  {
    question: "What is Catapult?",
    answer:
      "Catapult is a 36-hour hackathon where students come together to build innovative projects, attend workshops, and compete for prizes. Whether you're a beginner or experienced, there's something for everyone.",
  },
  {
    question: "Who can participate?",
    answer:
      "Catapult is open to all college students regardless of major or experience level. You don't need any prior coding experience; we'll have workshops to help you get started.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Nothing! Catapult is completely free to attend. We provide meals, snacks, swag, and everything you need for the weekend.",
  },
  {
    question: "How does registration work?",
    answer:
      "You can register through the Luma page. We accept registrations on a first-come first-serve basis according to the number of participants we can cater for. Registered participants MUST check in by 10:00PM on Friday to secure their food badge or it will be forfeited to walk-ins.",
  },
  {
    question: "I wasn't accepted during registration. Can I still participate?",
    answer:
      "Yes! Registration is mainly a limit on the number of students who will have a food badge since catering is our largest expense. Starting at 10:00PM on Friday, we will distribute any unclaimed food badges to unregistered participants on a first-come first-serve basis. Even if you are unable to secure a badge, you will still be permitted to submit a project.",
  },
  {
    question: "Do I need a team?",
    answer:
      "Nope! You can come solo and form a team at our team formation event on Friday night. Teams can have up to 6 members.",
  },
  {
    question: "What should I bring?",
    answer:
      "Bring your laptop, charger, and anything you need to be comfortable for the weekend. We'll provide Wi-Fi, food, and a place to work.",
  },
  {
    question: "Where is it held?",
    answer:
      "Catapult takes place at WALC. Check-in starts at 8:00 PM on Friday, April 3rd in BHEE 129 but the remainder of the Hackathon will be held in WALC. Specific rooms and their purposes will be uploaded at a later date.",
  },
  {
    question: "What can I build?",
    answer:
      "Anything you want! Web apps, mobile apps, hardware hacks, games, AI projects — the sky's the limit. Projects will be judged on creativity, technical difficulty, design, and usefulness.",
  },
  {
    question: "Will there be prizes?",
    answer:
      "Yes! We'll have prizes for overall winners as well as category-specific awards. Everyone who makes a genuine submission and attends our closing ceremony will also get a prize! Details will be announced at the opening ceremony.",
  },
  {
    question: "How will judging work?",
    answer:
      "Judging will be in 2 rounds. The first round will consist of selecting the best 12 teams from their project videos on DevPost according to a strict rubric. They will then get the chance to present in a Shark Tank style their project to the audience and judges.",
  },
  {
    question: "Can I still participate if I do not know any machine learning?",
    answer:
      "Yes! Although this hackathon is centered around it, we encourage you to use your other talents to make a project. We have awarded prizes to projects that did not use any AI in the past. Furthermore, you can attend our workshops during the hackathon to get a good foundation for using certain tools along with attending our team making event.",
  },
  {
    question: "Will you provide compute for projects?",
    answer: "Yes! We will be able to provide credits to use Modal GPUs and access to Purdue's RCAC clusters.",
  },
  {
    question: "Can I attend virtually / remotely?",
    answer: "Not really. You must be present in person to: 1) check-in and 2) for the second round of judging. However, you do not need to be physically present at WALC in-between.",
  }
];

function FaqItem({ question, answer, isOpen, onClick, index, visible }) {
  const contentRef = useRef(null);
  const delay = 150 + index * 100;

  return (
    <div
      className={`transition-all ease-out ${visible ? "opacity-100 translate-x-0 duration-700" : "opacity-0 -translate-x-10 duration-500"}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      <button
        onClick={onClick}
        className="w-full text-left cursor-pointer group py-4"
      >
        <div className="flex items-center justify-between gap-4">
          <h3
            className={`text-xl font-bold tracking-tight transition-colors duration-200 ${isOpen ? "text-[#151c43]" : "text-[#151c43]/80 group-hover:text-[#151c43]"}`}
          >
            {question}
          </h3>
          <svg
            className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isOpen ? "text-[#151c43] rotate-45" : "text-[#151c43]/30 group-hover:text-[#151c43]/60"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight + "px" : "0px",
        }}
      >
        <p className="pb-3 text-[#151c43]/55 leading-relaxed text-base pr-4">
          {answer}
        </p>
      </div>
      <div
        className={`h-px transition-all duration-500 ${isOpen ? "bg-[#151c43]/10 w-full" : "bg-[#151c43]/5 w-3/4"}`}
      />
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
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
    <section ref={sectionRef} id="faq" className="relative">
      {/* Smooth multi-stop gradient transition */}
      <div
        className="h-72"
        style={{
          background:
            "linear-gradient(to bottom, #151c43 0%, #182748 15%, #1d3555 30%, #254860 45%, #306b6d 60%, #439880 75%, #56c19e 88%, #6be5be 100%)",
        }}
      />

      <div className="relative bg-[#6be5be] pt-20 pb-28 px-6 overflow-hidden">
        <CurvedLines />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Side-by-side: FAQ title left, questions right */}
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            {/* Left — sticky title */}
            <div
              className={`md:w-1/3 md:sticky md:top-24 md:self-start transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-[#151c43] tracking-tight leading-tight">
                Frequently Asked Questions
              </h2>
              <div className="mt-5 w-16 h-1 rounded-full bg-[#151c43]/20" />
            </div>

            {/* Right — all questions in one column */}
            <div className="md:w-2/3">
              {faqData.map((item, index) => (
                <FaqItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  index={index}
                  visible={visible}
                />
              ))}
            </div>
          </div>
          {/* Discord CTA */}
          <div
            className={`mt-12 transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{
              transitionDelay: visible
                ? `${150 + faqData.length * 100 + 200}ms`
                : "0ms",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl bg-[#151c43]/[0.06] backdrop-blur-sm px-6 py-5">
              <div className="flex-1">
                <p className="text-[#151c43] font-semibold text-lg">
                  Still have questions?
                </p>
                <p className="text-[#151c43]/55 text-sm mt-1">
                  Join our Discord server and ask us anything — we're happy to
                  help.
                </p>
              </div>
              <a
                href="https://discord.gg/uPFHbPCJ9X"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#151c43] text-[#6be5be] font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#151c43]/90 transition-colors duration-200 shrink-0"
              >
                <Image
                  src="/discord.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                Join our Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
