"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useCursor } from "./CustomCursor";

const MARQUEE_ITEMS_1 = [
  "DIRECTION ARTISTIQUE",
  "BRANDING IMMERSIF",
  "EXPÉRIENCES DIGITALES",
  "MOTION 3D & VFX",
  "CREATIVE DEVELOPMENT",
  "ARCHITECTURE SPATIALE",
  "DESIGN SYSTÈMES",
  "TYPOGRAPHIE EXPÉRIMENTALE",
];

const MARQUEE_ITEMS_2 = [
  "BALENCIAGA",
  "TEENAGE ENGINEERING",
  "LVMH DIGITAL",
  "POLESTAR DESIGN",
  "RIMOWA ARCHIVES",
  "JACQUEMUS",
  "SONY MUSIC INNOVATION",
  "ACNE STUDIOS",
];

export default function Marquee() {
  const { setCursor, resetCursor } = useCursor();

  return (
    <section
      className="py-12 sm:py-16 overflow-hidden border-y border-lumora-dark/10 bg-white/50 backdrop-blur-sm select-none"
      onMouseEnter={() => setCursor("pointer")}
      onMouseLeave={resetCursor}
    >
      {/* Track 1 */}
      <div className="flex overflow-hidden whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 28,
          }}
          className="flex items-center gap-8 pr-8 shrink-0"
        >
          {[...MARQUEE_ITEMS_1, ...MARQUEE_ITEMS_1].map((item, index) => (
            <div key={index} className="flex items-center gap-8">
              <span className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-lumora-dark hover:text-lumora-accent transition-colors duration-300">
                {item}
              </span>
              <span className="inline-block w-3 h-3 rounded-full bg-lumora-accent" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Track 2 */}
      <div className="flex overflow-hidden whitespace-nowrap mt-4 sm:mt-6">
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 32,
          }}
          className="flex items-center gap-8 pr-8 shrink-0"
        >
          {[...MARQUEE_ITEMS_2, ...MARQUEE_ITEMS_2].map((client, index) => (
            <div key={index} className="flex items-center gap-8">
              <span className="text-xl sm:text-3xl lg:text-4xl font-mono uppercase tracking-widest text-lumora-muted hover:text-lumora-dark transition-colors duration-300">
                {client}
              </span>
              <Sparkles className="w-4 h-4 text-lumora-accent stroke-[2.5]" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
