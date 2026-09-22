"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import Magnetic from "./Magnetic";
import { useCursor } from "./CustomCursor";

const SOCIAL_LINKS = [
  { name: "Awwwards", href: "https://awwwards.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "X (Twitter)", href: "https://x.com" },
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  const [parisTime, setParisTime] = useState("");
  const [tokyoTime, setTokyoTime] = useState("");
  const [nyTime, setNyTime] = useState("");
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setParisTime(
        now.toLocaleTimeString("fr-FR", {
          timeZone: "Europe/Paris",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setTokyoTime(
        now.toLocaleTimeString("ja-JP", {
          timeZone: "Asia/Tokyo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setNyTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="pt-20 pb-10 bg-[#FAFAF8] border-t border-[#111110]/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Top Info Grid: Clocks & Locations */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-[#111110]/10">
          {/* Studio Description */}
          <div className="md:col-span-4">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF3B1D] uppercase block mb-3">
              [ LUMORA // ATELIER CRÉATIF ]
            </span>
            <p className="text-sm text-[#6E6E6A] leading-relaxed max-w-sm">
              Studio indépendant de direction artistique, design d&apos;interfaces et technologies créatives. Conçu pour inspirer et marquer l&apos;histoire visuelle.
            </p>
          </div>

          {/* Live Studio Clocks */}
          <div className="md:col-span-5 grid grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E6E6A] block mb-1">
                PARIS
              </span>
              <span className="text-sm font-mono font-bold text-[#111110]">
                {parisTime || "12:00:00"}
              </span>
              <span className="text-[10px] font-mono text-[#FF3B1D] block mt-0.5">
                CET
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E6E6A] block mb-1">
                TOKYO
              </span>
              <span className="text-sm font-mono font-bold text-[#111110]">
                {tokyoTime || "20:00:00"}
              </span>
              <span className="text-[10px] font-mono text-[#FF3B1D] block mt-0.5">
                JST
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E6E6A] block mb-1">
                NEW YORK
              </span>
              <span className="text-sm font-mono font-bold text-[#111110]">
                {nyTime || "06:00:00"}
              </span>
              <span className="text-[10px] font-mono text-[#FF3B1D] block mt-0.5">
                EST
              </span>
            </div>
          </div>

          {/* Back to Top */}
          <div className="md:col-span-3 flex md:justify-end items-start">
            <Magnetic strength={0.35}>
              <button
                onClick={scrollToTop}
                onMouseEnter={() => setCursor("pointer")}
                onMouseLeave={resetCursor}
                className="group flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-wider text-[#111110] border border-[#111110]/15 px-5 py-3 rounded-full hover:border-[#111110] transition-colors focus:outline-none"
              >
                <span>HAUT DE PAGE</span>
                <span className="transition-transform duration-300 group-hover:-translate-y-1">
                  <ArrowUp className="w-3.5 h-3.5 text-[#FF3B1D] stroke-[2.5]" />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Social Links Bar */}
        <div className="py-8 border-b border-[#111110]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {SOCIAL_LINKS.map((link) => (
              <Magnetic key={link.name} strength={0.25}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursor("pointer")}
                  onMouseLeave={resetCursor}
                  className="group relative text-xs font-mono uppercase tracking-wider text-[#111110] hover:text-[#FF3B1D] transition-colors duration-200"
                >
                  <span>{link.name}</span>
                  <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-[#FF3B1D] transition-all duration-300 group-hover:w-full" />
                </a>
              </Magnetic>
            ))}
          </div>

          <div className="text-xs font-mono text-[#6E6E6A]">
            © {new Date().getFullYear()} LUMORA STUDIO. TOUS DROITS RÉSERVÉS.
          </div>
        </div>

        {/* Monumental Footer Typography Sliding Up from Bottom */}
        <div className="overflow-hidden pt-8 select-none">
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full text-center"
          >
            <h2 className="text-[17vw] font-black uppercase tracking-tighter leading-[0.8] text-[#111110]/95 hover:text-[#FF3B1D] transition-colors duration-700">
              LUMORA
            </h2>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
