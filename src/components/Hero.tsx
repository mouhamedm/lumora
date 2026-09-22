"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowDown } from "lucide-react";
import Magnetic from "./Magnetic";
import { useCursor } from "./CustomCursor";

const HERO_WORDS_LINE_1 = ["DESIGN", "RADICAL"];
const HERO_WORDS_LINE_2 = ["&", "EXPÉRIENCES"];
const HERO_WORDS_LINE_3 = ["INOUBLIABLES."];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  // Mouse Parallax Values for Interactive Floating Element
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax transforms for the interactive card
  const cardX = useTransform(smoothMouseX, [-400, 400], [-25, 25]);
  const cardY = useTransform(smoothMouseY, [-400, 400], [-25, 25]);
  const cardRotateX = useTransform(smoothMouseY, [-400, 400], [12, -12]);
  const cardRotateY = useTransform(smoothMouseX, [-400, 400], [-14, 14]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col justify-between overflow-hidden bg-[#FAFAF8]"
    >
      {/* Background Decorative subtle grid dots */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage:
            "radial-gradient(#111110 0.75px, transparent 0.75px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full relative z-10 my-auto">
        {/* Studio Sub-Header / Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-[#111110]/8 pb-5"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF3B1D] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF3B1D]" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#111110] font-semibold">
              PARIS • TOKYO — STUDIO DISPONIBLE Q3/Q4
            </span>
          </div>

          <span className="hidden sm:block text-xs font-mono tracking-wider text-[#6E6E6A]">
            LAT 48.8566° N, LON 2.3522° E
          </span>
        </motion.div>

        {/* Monumental Hero Headline with Staggered Word Mask & Blur-In */}
        <div className="relative">
          <h1 className="text-[13vw] sm:text-[11vw] lg:text-[10vw] font-black uppercase tracking-[-0.04em] leading-[0.88] text-[#111110] select-none">
            {/* Line 1 */}
            <div className="flex flex-wrap gap-x-4 sm:gap-x-8 overflow-hidden pb-1 sm:pb-3">
              {HERO_WORDS_LINE_1.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ y: "120%", opacity: 0, filter: "blur(14px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 1,
                    delay: 0.15 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Line 2 with Floating Parallax Element next to it on desktop */}
            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-8 overflow-hidden pb-1 sm:pb-3">
              {HERO_WORDS_LINE_2.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ y: "120%", opacity: 0, filter: "blur(14px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 1,
                    delay: 0.35 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`inline-block ${
                    word === "&"
                      ? "text-[#FF3B1D] font-serif italic font-normal tracking-normal"
                      : ""
                  }`}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {/* Line 3 */}
            <div className="flex flex-wrap gap-x-4 sm:gap-x-8 overflow-hidden pb-1 sm:pb-3">
              {HERO_WORDS_LINE_3.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ y: "120%", opacity: 0, filter: "blur(14px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 1,
                    delay: 0.55 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block text-stroke-accent hover:text-[#FF3B1D] transition-colors duration-500"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h1>

          {/* Floating Parallax Interactive Card (Desktop) */}
          <motion.div
            style={{
              x: cardX,
              y: cardY,
              rotateX: cardRotateX,
              rotateY: cardRotateY,
              transformPerspective: 1000,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex absolute -right-4 top-1/4 flex-col gap-3 rounded-2xl bg-white/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl border border-[#111110]/10 w-72 pointer-events-auto select-none"
            onMouseEnter={() => setCursor("pointer")}
            onMouseLeave={resetCursor}
          >
            <div className="flex items-center justify-between border-b border-[#111110]/8 pb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#111110]">
                STUDIO CORE v2.6
              </span>
              <span className="flex h-2 w-2 rounded-full bg-[#FF3B1D]" />
            </div>

            <p className="text-xs text-[#6E6E6A] leading-relaxed">
              Direction artistique d&apos;avant-garde & ingénierie d&apos;interaction pour marques audacieuses.
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-[#111110]/60 uppercase">
                TAUX D&apos;IMPACT
              </span>
              <span className="text-xs font-mono font-bold text-[#FF3B1D]">
                +340% ENGAGEMENT
              </span>
            </div>
          </motion.div>
        </div>

        {/* Hero Bottom Bar: Mission statement + CTA + Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 sm:mt-16 pt-8 border-t border-[#111110]/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-end"
        >
          {/* Mission description */}
          <div className="md:col-span-6 lg:col-span-5">
            <p className="text-base sm:text-lg text-[#6E6E6A] font-normal leading-relaxed">
              Nous fusionnons <strong className="text-[#111110] font-semibold">art visuel haute fidélité</strong> et{" "}
              <strong className="text-[#111110] font-semibold">développement créatif de pointe</strong> pour transformer des visions d&apos;exception en artefacts culturels inoubliables.
            </p>
          </div>

          {/* Quick links & buttons */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-wrap items-center md:justify-end gap-5">
            <Magnetic strength={0.4}>
              <a
                href="#projects"
                className="group relative flex items-center gap-3 rounded-full bg-[#111110] px-7 py-4 text-xs font-bold uppercase tracking-widest text-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#FF3B1D]/25"
                onMouseEnter={() => setCursor("pointer")}
                onMouseLeave={resetCursor}
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-[#FF3B1D] transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-10">Explorer les réalisations</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </a>
            </Magnetic>

            <Magnetic strength={0.3}>
              <a
                href="#manifesto"
                className="flex items-center gap-2 rounded-full border border-[#111110]/20 px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#111110] transition-colors hover:border-[#111110] hover:bg-[#111110]/5"
                onMouseEnter={() => setCursor("pointer")}
                onMouseLeave={resetCursor}
              >
                <span>Notre Manifeste</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#FF3B1D] stroke-[2.5]" />
              </a>
            </Magnetic>
          </div>
        </motion.div>
      </div>

      {/* Subtle Scroll Down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="max-w-7xl mx-auto px-6 sm:px-10 w-full mt-10 hidden sm:flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#6E6E6A]"
      >
        <span>SCROLL POUR DÉCOUVRIR</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex items-center gap-2"
        >
          <span>DÉFILEMENT</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#FF3B1D] stroke-[2.5]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
