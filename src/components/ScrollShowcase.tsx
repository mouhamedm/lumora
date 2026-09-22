"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useCursor } from "./CustomCursor";

const MANIFESTO_LINES = [
  { text: "NOUS REFUSONS L'ORDINAIRE.", highlight: false },
  { text: "DANS UN UNIVERS D'INTERFACES SANS ÂME,", highlight: false },
  { text: "NOUS FORGEONS DES EXPÉRIENCES RADICALES", highlight: true },
  { text: "QUI CAPTIVENT L'ATTENTION,", highlight: false },
  { text: "DÉCLENCHENT L'ÉMOTION PURE", highlight: true },
  { text: "ET IMPLANTENT VOTRE MARQUE DANS L'AVENIR.", highlight: false },
];

export default function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  // Scroll tracking across the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Showcase frame transformations driven by scroll
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.84, 1, 0.95]);
  const borderRadius = useTransform(scrollYProgress, [0.1, 0.45], [48, 16]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.5], [-2, 0]);
  const imageScale = useTransform(scrollYProgress, [0.1, 0.8], [1.2, 1]);

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative py-20 sm:py-32 bg-lumora-bg overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="mb-14 pb-6 border-b border-lumora-dark/10 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-lumora-accent">
            [ 02 // MANIFESTE & VISION DIGITALE ]
          </span>
          <span className="text-xs font-mono text-lumora-muted tracking-wider uppercase">
            SCROLL-DRIVEN SHOWCASE // MOTION ENGAGED
          </span>
        </div>

        {/* Scroll-Driven Dynamic Studio Showcase Frame */}
        <div className="relative mb-24 flex justify-center">
          <motion.div
            style={{
              scale,
              borderRadius,
              rotate,
            }}
            className="relative w-full aspect-16/10 sm:aspect-21/9 overflow-hidden shadow-2xl shadow-black/10 border border-lumora-dark/10 bg-lumora-dark"
            onMouseEnter={() => setCursor("project", "DISCOVER")}
            onMouseLeave={resetCursor}
          >
            {/* Background Cinematic Visual */}
            <motion.div
              style={{
                scale: imageScale,
                backgroundImage:
                  "radial-gradient(circle at center, rgba(255, 59, 29, 0.25) 0%, rgba(17, 17, 16, 0.85) 75%), url('/assets/images/showcase-architecture.jpg')",
              }}
              className="absolute inset-0 bg-cover bg-center"
            >
              <div className="absolute inset-0 bg-linear-to-t from-lumora-dark via-transparent to-lumora-dark/40" />
            </motion.div>

            {/* In-Frame Studio Watermark & Live Metadata */}
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between text-white z-10 pointer-events-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-lumora-accent animate-ping" />
                  <span>SHOWREEL // LUMORA STUDIOS</span>
                </div>
                <span className="text-xs font-mono tracking-widest text-white/70">
                  REF. {new Date().getFullYear()}-X
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase text-lumora-accent font-bold block mb-1">
                    DIRECTION ARCHITECTURALE & MOTION
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
                    L&apos;ESTHÉTIQUE DE LA PRÉCISION.
                  </h3>
                </div>
                <div className="text-right font-mono text-xs text-white/70 hidden sm:block">
                  <span>EXPÉRIENCE HAUTE DÉFINITION</span>
                  <br />
                  <span>4K 60FPS SYNCHRONISÉ</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll-Driven Typography */}
        <div className="max-w-4xl mx-auto my-12 sm:my-20">
          <div className="flex flex-col gap-6 sm:gap-8">
            {MANIFESTO_LINES.map((line, idx) => {
              const step = 0.5 / MANIFESTO_LINES.length;
              const start = 0.35 + idx * step;
              const end = start + step;

              return (
                <ManifestoLine
                  key={idx}
                  line={line}
                  scrollYProgress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ManifestoLine({
  line,
  scrollYProgress,
  range,
}: {
  line: { text: string; highlight: boolean };
  scrollYProgress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(scrollYProgress, range, [0.2, 1]);
  const x = useTransform(scrollYProgress, range, [-15, 0]);

  return (
    <motion.p
      style={{ opacity, x }}
      className={`text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight transition-colors duration-200 ${
        line.highlight ? "text-lumora-accent" : "text-lumora-dark"
      }`}
    >
      {line.text}
    </motion.p>
  );
}
