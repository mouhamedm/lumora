import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useScroll, useMotionValueEvent } from "motion/react";
import {
  Sparkles,
  Code2,
  Cpu,
  Layers,
  Zap,
  Gauge,
  ShieldCheck,
  Box,
  Activity,
  ArrowRight,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../lib/utils";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

interface PointItemProps {
  number: string;
  title: string;
  description: string;
  thresholdStart: number;
  thresholdEnd: number;
  scrollProgress: number;
  icon: React.ElementType;
}

const getBarPercentageHeight = (
  scrollProgress: number,
  thresholdStart: number,
  thresholdEnd: number,
) => {
  if (scrollProgress < thresholdStart) return 0;
  if (scrollProgress > thresholdEnd) return 100;
  return ((scrollProgress - thresholdStart) / (thresholdEnd - thresholdStart)) * 100;
};

const PointItem: React.FC<PointItemProps> = ({
  number,
  title,
  description,
  thresholdStart,
  thresholdEnd,
  scrollProgress,
  icon: Icon,
}) => {
  const barHeightPercentage = getBarPercentageHeight(
    scrollProgress,
    thresholdStart,
    thresholdEnd,
  );
  const isActive = barHeightPercentage > 0;
  const isCurrent = barHeightPercentage > 0 && barHeightPercentage < 100;

  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-500 w-full group",
        isActive ? "opacity-100" : "opacity-40",
      )}
    >
      {/* Number and Icon Header */}
      <div className="flex items-center gap-3 mb-2.5">
        <div
          className={cn(
            "w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl flex items-center justify-center text-xs sm:text-[13px] font-[var(--font-mono)] font-bold transition-all duration-300 shrink-0",
            isActive
              ? "bg-[var(--accent)] text-white shadow-[0_0_18px_rgba(76,141,255,0.4)]"
              : "bg-white/5 text-zinc-500 border border-white/10",
          )}
        >
          {number}
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium transition-all duration-300",
            isCurrent
              ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[rgba(76,141,255,0.3)] shadow-[0_0_14px_rgba(76,141,255,0.2)]"
              : "bg-white/5 text-zinc-400 border border-white/5",
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{isCurrent ? "En action" : "Expertise"}</span>
        </div>
      </div>

      {/* Progress track & Content */}
      <div className="w-full flex pl-1 sm:pl-2">
        <div className="w-[28px] sm:w-[32px] flex items-start justify-center relative shrink-0">
          {/* Base track line */}
          <div className="h-full w-[2px] bg-white/10 absolute top-0 left-1/2 -translate-x-1/2 rounded-full" />
          {/* Active filled line */}
          <div
            className="w-[2px] bg-gradient-to-b from-[#6ea1ff] via-[var(--accent)] to-[#1A6FE8] absolute top-0 left-1/2 -translate-x-1/2 rounded-full shadow-[0_0_12px_rgba(76,141,255,0.8)] transition-all duration-100"
            style={{ height: `${barHeightPercentage}%` }}
          />
        </div>

        <div className="w-[calc(100%-28px)] sm:w-[calc(100%-32px)] pl-3 sm:pl-4 pb-3.5 sm:pb-4">
          <h3
            className={cn(
              "font-display text-base sm:text-lg md:text-xl lg:text-[22px] font-bold mb-1.5 transition-colors duration-300 leading-snug",
              isActive ? "text-white" : "text-zinc-500",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "font-[var(--font-body)] text-sm md:text-[15px] leading-relaxed max-w-[480px] transition-colors duration-300",
              isActive ? "text-zinc-300" : "text-zinc-500",
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function WhatIDo() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const ctx = gsap.context(() => {
      // Eyebrow reveal
      gsap.fromTo(
        ".whatido-eyebrow",
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 90%",
            once: true,
            fastScrollEnd: true,
          },
        },
      );

      // Left column points reveal
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            delay: 0.2,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 88%",
              once: true,
              fastScrollEnd: true,
            },
          },
        );
      }

      // Right column cards container reveal
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { opacity: 0, x: 50, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            delay: 0.3,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: rightColRef.current,
              start: "top 88%",
              once: true,
              fastScrollEnd: true,
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const isCard1 = scrollProgress <= 0.25;
  const isCard2 = scrollProgress > 0.25 && scrollProgress <= 0.5;
  const isCard3 = scrollProgress > 0.5 && scrollProgress <= 0.75;
  const isCard4 = scrollProgress > 0.75;

  return (
    <section
      id="what-i-do"
      ref={containerRef}
      className="relative w-full bg-[var(--color-bg-base)] pt-12 sm:pt-16 md:pt-20 lg:pt-16 mb-16 md:mb-28 lg:mb-32"
    >
      {/* Scrollable multi-viewport container to drive the sticky reveal on desktop, natural flow on mobile */}
      <div className="relative w-full h-auto lg:h-[400vh]">
        <div className="relative static h-auto min-h-0 w-full flex flex-col justify-center py-8 px-4 sm:px-6 md:px-12 max-w-[1340px] mx-auto z-20 lg:sticky lg:top-0 lg:h-screen lg:max-h-screen lg:py-8">
          {/* Section Header */}
          <div ref={headerRef} className="text-center mb-5 lg:mb-7 shrink-0">
            <div
              className="whatido-eyebrow inline-flex items-center font-[var(--font-mono)] text-xs font-medium tracking-[0.1em] uppercase text-[var(--accent)] mb-2.5 px-4 py-1.5 bg-[var(--accent-soft)] border border-[rgba(76,141,255,0.2)] rounded-full shadow-[0_0_16px_rgba(76,141,255,0.12)]"
              aria-hidden="true"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[var(--accent)]" />
              {t("whatido.eyebrow")}
            </div>
            <h2 className="font-display text-[clamp(38px,4.5vw,64px)] lg:text-[64px] leading-[1.15] font-bold text-white mb-4">
              <TextReveal
                text={t("whatido.title_start")}
                type="chars"
                spanClassName="title-glow"
                triggerRef={headerRef}
              />{" "}
              <TextReveal
                text={t("whatido.title_highlight")}
                type="chars"
                spanClassName="highlight"
                delay={0.25}
                triggerRef={headerRef}
              />
              {t("whatido.title_end") ? (
                <>
                  {" "}
                  <TextReveal
                    text={t("whatido.title_end")}
                    type="chars"
                    delay={0.45}
                    triggerRef={headerRef}
                  />
                </>
              ) : null}
            </h2>
            <div className="font-[var(--font-body)] text-sm sm:text-base text-[var(--text-secondary)] max-w-[580px] mx-auto leading-relaxed">
              <TextReveal
                text={t("whatido.subtitle")}
                type="words"
                delay={0.35}
                triggerRef={headerRef}
              />
            </div>
          </div>

          {/* Grid Layout: Left Progress Points & Right Dynamic Visual Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Left Column: Vertical Reveal Items */}
            <div ref={leftColRef} className="lg:col-span-6 flex flex-col justify-center space-y-1 sm:space-y-1.5">
              <PointItem
                number={t("whatido.p1_number")}
                title={t("whatido.p1_title")}
                description={t("whatido.p1_desc")}
                thresholdStart={0}
                thresholdEnd={0.25}
                scrollProgress={scrollProgress}
                icon={Code2}
              />
              <PointItem
                number={t("whatido.p2_number")}
                title={t("whatido.p2_title")}
                description={t("whatido.p2_desc")}
                thresholdStart={0.25}
                thresholdEnd={0.5}
                scrollProgress={scrollProgress}
                icon={Cpu}
              />
              <PointItem
                number={t("whatido.p3_number")}
                title={t("whatido.p3_title")}
                description={t("whatido.p3_desc")}
                thresholdStart={0.5}
                thresholdEnd={0.75}
                scrollProgress={scrollProgress}
                icon={Layers}
              />
              <PointItem
                number={t("whatido.p4_number")}
                title={t("whatido.p4_title")}
                description={t("whatido.p4_desc")}
                thresholdStart={0.75}
                thresholdEnd={1.0}
                scrollProgress={scrollProgress}
                icon={Smartphone}
              />
            </div>

            {/* Right Column: Dynamic Interactive Visual Cards (NO external images) */}
            <div
              ref={rightColRef}
              className="lg:col-span-6 relative w-full h-[480px] sm:h-[500px] md:h-[520px] lg:h-[460px] flex items-center justify-center mt-8 lg:mt-0"
            >
              {/* Subtle ambient backglow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-indigo-600/20 rounded-3xl blur-3xl opacity-60 pointer-events-none translate-z-0" />

              {/* CARD 1: Creative 3D & WebGL Canvas Preview */}
              <div
                className={cn(
                  "absolute inset-0 w-full h-full rounded-2xl bg-[rgba(19,19,22,0.85)] border border-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(76,141,255,0.15)] transition-[opacity,transform] duration-500",
                  isCard1
                    ? "opacity-100 scale-100 pointer-events-auto z-10"
                    : "opacity-0 scale-95 pointer-events-none z-0",
                )}
              >
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2 font-[var(--font-mono)] text-xs text-zinc-400">
                      WebGLCanvas.tsx — 60 FPS
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-[var(--font-mono)] text-blue-400">
                    <Zap className="w-3 h-3 text-blue-400" />
                    GSAP + Three.js
                  </div>
                </div>

                {/* Animated Simulated Visualizer & Code */}
                <div className="relative my-3 flex-1 flex flex-col justify-center rounded-xl bg-[#09090b]/80 border border-white/5 p-3.5 font-[var(--font-mono)] text-xs overflow-hidden">
                  {/* Rotating 3D wireframe polygon visual in background */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-40 h-40 opacity-25 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_12s_linear_infinite]">
                      <polygon
                        points="50,5 90,25 90,75 50,95 10,75 10,25"
                        fill="none"
                        stroke="#4c8dff"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      <polygon
                        points="50,18 80,33 80,67 50,82 20,67 20,33"
                        fill="none"
                        stroke="#6ea1ff"
                        strokeWidth="1"
                      />
                      <circle cx="50" cy="50" r="14" fill="#4c8dff" fillOpacity="0.3" />
                    </svg>
                  </div>

                  {/* Code snippet lines */}
                  <div className="space-y-1 relative z-10 text-zinc-300">
                    <div className="flex gap-3">
                      <span className="text-zinc-600 select-none">01</span>
                      <span>
                        <span className="text-blue-400">const</span> scene ={" "}
                        <span className="text-amber-300">new</span>{" "}
                        <span className="text-cyan-300">THREE.Scene</span>();
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-zinc-600 select-none">02</span>
                      <span>
                        <span className="text-blue-400">const</span> mesh ={" "}
                        <span className="text-amber-300">new</span>{" "}
                        <span className="text-cyan-300">THREE.Mesh</span>(geometry, shader);
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-zinc-600 select-none">03</span>
                      <span>
                        <span className="text-purple-400">gsap</span>.to(mesh.rotation, &#123;
                      </span>
                    </div>
                    <div className="flex gap-3 pl-4">
                      <span className="text-zinc-600 select-none">04</span>
                      <span>
                        y: Math.PI * 2, duration: 4, ease:{" "}
                        <span className="text-emerald-400">&quot;power2.out&quot;</span>
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-zinc-600 select-none">05</span>
                      <span>&#125;);</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-blue-400" /> Three.js 3D
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> 60 FPS Locked
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    WebGL Shaders
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Framer Motion
                  </span>
                </div>
              </div>

              {/* CARD 2: Full-Stack Architecture & Speed */}
              <div
                className={cn(
                  "absolute inset-0 w-full h-full rounded-2xl bg-[rgba(19,19,22,0.85)] border border-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(76,141,255,0.15)] transition-[opacity,transform] duration-500",
                  isCard2
                    ? "opacity-100 scale-100 pointer-events-auto z-10"
                    : "opacity-0 scale-95 pointer-events-none z-0",
                )}
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-[var(--font-mono)] text-xs text-white font-semibold">
                      Production Cluster Active
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-[var(--font-mono)] text-emerald-400">
                    <Gauge className="w-3 h-3" />
                    100/100 Lighthouse
                  </div>
                </div>

                {/* Lighthouse 4 Ring Audit Visual */}
                <div className="my-2 grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                  {[
                    { label: "Performance", score: "100" },
                    { label: "Accessibility", score: "100" },
                    { label: "Best Practices", score: "100" },
                    { label: "SEO", score: "100" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="p-1.5 sm:p-2 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center gap-1"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-400/80 bg-emerald-500/10 flex items-center justify-center text-[11px] sm:text-xs font-bold text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                        {metric.score}
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-zinc-400 font-medium truncate w-full mt-0.5">
                        {metric.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Realtime API / Data status metrics */}
                <div className="space-y-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-[var(--font-mono)]">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="text-zinc-500">Firebase Sync:</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Realtime Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="text-zinc-500">Avg. Edge Latency:</span>
                    <span className="text-blue-400">14 ms</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="text-zinc-500">Zero-Downtime Pipeline:</span>
                    <span className="text-zinc-200">Continuous CI/CD</span>
                  </div>
                </div>

                {/* Bottom Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Next.js App Router
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Firebase Cloud
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Edge Caching
                  </span>
                </div>
              </div>

              {/* CARD 3: Design Systems & Immersive UI/UX */}
              <div
                className={cn(
                  "absolute inset-0 w-full h-full rounded-2xl bg-[rgba(19,19,22,0.85)] border border-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(76,141,255,0.15)] transition-[opacity,transform] duration-500",
                  isCard3
                    ? "opacity-100 scale-100 pointer-events-auto z-10"
                    : "opacity-0 scale-95 pointer-events-none z-0",
                )}
              >
                {/* Design Tokens Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span className="font-[var(--font-mono)] text-xs text-white font-semibold">
                      DesignSystem.tokens.css
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-[var(--font-mono)] text-purple-300">
                    Pixel-Perfect AA+
                  </div>
                </div>

                {/* Design System Interactive Tokens & UI Elements */}
                <div className="space-y-2 my-1.5">
                  {/* Swatches */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-xs text-zinc-400 font-[var(--font-mono)]">Color Tokens</span>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#4c8dff] shadow-[0_0_8px_#4c8dff]" title="#4C8DFF" />
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#1a6fe8]" title="#1A6FE8" />
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#0b0b0c] border border-white/20" title="#0B0B0C" />
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#17171a] border border-white/10" title="#17171A" />
                    </div>
                  </div>

                  {/* Micro-interaction interactive preview */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/30 to-purple-950/30 border border-blue-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">Dynamic Glass Card</p>
                      <p className="text-[11px] text-zinc-400 font-[var(--font-mono)] mt-0.5">
                        stiffness: 300 · damping: 24
                      </p>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold shadow-[0_0_15px_rgba(76,141,255,0.5)] transition-all duration-300 flex items-center gap-1 group"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Fluid Typography
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Spring Animations
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Responsive Breakpoints
                  </span>
                </div>
              </div>

              {/* CARD 4: Mobile-First & Applications Cross-Platform */}
              <div
                className={cn(
                  "absolute inset-0 w-full h-full rounded-2xl bg-[rgba(19,19,22,0.85)] border border-white/10 backdrop-blur-xl p-4 sm:p-5 md:p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(76,141,255,0.15)] transition-[opacity,transform] duration-500",
                  isCard4
                    ? "opacity-100 scale-100 pointer-events-auto z-10"
                    : "opacity-0 scale-95 pointer-events-none z-0",
                )}
              >
                {/* Mobile Window Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-2 font-[var(--font-mono)] text-xs text-zinc-400">
                      MobileApp.dart — 120 FPS
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-[var(--font-mono)] text-cyan-300">
                    <Smartphone className="w-3 h-3 text-cyan-300" />
                    Flutter & Dart
                  </div>
                </div>

                {/* Simulated Sleek Mobile Device Screen */}
                <div className="relative my-2 p-3 sm:p-3.5 rounded-xl bg-[#09090b]/90 border border-white/5 flex flex-col justify-between overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-[var(--font-mono)] mb-2 px-1 border-b border-white/5 pb-1">
                    <span className="text-zinc-400 font-semibold">09:41</span>
                    <div className="w-14 h-1.5 rounded-full bg-white/10 mx-auto" />
                    <span className="text-cyan-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      5G · 100%
                    </span>
                  </div>

                  {/* App Screen Content Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-lg bg-white/[0.04] border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">Cross-Platform Engine</p>
                          <p className="text-[10px] text-zinc-400 font-[var(--font-mono)]">iOS & Android Native Compilation</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-[var(--font-mono)] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        120 Hz
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-zinc-500 font-[var(--font-mono)]">Frame Drops</div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-400 font-[var(--font-mono)] flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 0 dropped
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="text-[10px] text-zinc-500 font-[var(--font-mono)]">Architecture</div>
                        <div className="text-xs sm:text-sm font-bold text-cyan-300 font-[var(--font-mono)] truncate mt-0.5">
                          BLoC / Clean Arch
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> Flutter 3.x
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Dart & Skia Engine
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Cross-Platform
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300">
                    Offline First
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
