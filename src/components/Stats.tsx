"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "motion/react";
import { useCursor } from "./CustomCursor";

interface StatItem {
  id: string;
  target: number;
  suffix: string;
  decimals?: number;
  label: string;
  description: string;
}

const STATS_DATA: StatItem[] = [
  {
    id: "awards",
    target: 48,
    suffix: "+",
    label: "PRIX & DISTINCTIONS",
    description: "Awwwards Site of the Year, FWA of the Day, D&AD Yellow Pencils et Red Dot Best of the Best.",
  },
  {
    id: "projects",
    target: 160,
    suffix: "+",
    label: "PROJETS DÉPLOYÉS",
    description: "Plateformes e-commerce monumentales, identités complètes et architectures spatiales.",
  },
  {
    id: "retention",
    target: 99.4,
    suffix: "%",
    decimals: 1,
    label: "SATISFACTION CLIENTS",
    description: "Partenariats de long terme avec les leaders du luxe, de la tech et des institutions culturelles.",
  },
  {
    id: "experience",
    target: 8,
    suffix: " ANS",
    label: "ANNÉES D'INNOVATION",
    description: "Huit années d'ingénierie créative sans compromis entre Paris, Tokyo et New York.",
  },
];

export default function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });
  const { setCursor, resetCursor } = useCursor();

  return (
    <section
      id="stats"
      ref={containerRef}
      className="py-24 sm:py-36 bg-lumora-dark text-lumora-bg relative overflow-hidden"
    >
      {/* Subtle background glow effect */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-lumora-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-lumora-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 pb-8 border-b border-white/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-lumora-accent block mb-4">
              [ 04 // CHIFFRES CLÉS & RIGUEUR ]
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white max-w-2xl leading-[0.95]">
              LA MESURE DE L&apos;EXCELLENCE.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-lumora-bg/70 max-w-md font-normal leading-relaxed">
            Derrière chaque projet iconique se cachent des métriques concrètes d&apos;accélération et de rayonnement mondial.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          {STATS_DATA.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/3 border border-white/10 hover:border-lumora-accent/50 hover:bg-white/5 transition-all duration-300"
              onMouseEnter={() => setCursor("pointer")}
              onMouseLeave={resetCursor}
            >
              {/* Animated Counter */}
              <div>
                <div className="flex items-baseline gap-1 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-4">
                  <AnimatedNumber
                    target={item.target}
                    decimals={item.decimals}
                    startAnimation={isInView}
                  />
                  <span className="text-3xl sm:text-4xl text-lumora-accent font-mono">
                    {item.suffix}
                  </span>
                </div>

                <div className="h-1 w-10 bg-lumora-accent mb-6 rounded-full" />

                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white mb-2">
                  {item.label}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-lumora-bg/60 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({
  target,
  decimals = 0,
  startAnimation,
}: {
  target: number;
  decimals?: number;
  startAnimation: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    const controls = animate(0, target, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setCurrent(latest);
      },
    });

    return () => controls.stop();
  }, [target, startAnimation]);

  return <span>{current.toFixed(decimals)}</span>;
}
