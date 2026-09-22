"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import Magnetic from "./Magnetic";
import { useCursor } from "./CustomCursor";

export default function CtaSection() {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@lumora.studio");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-24 sm:py-40 bg-[#FAFAF8] relative overflow-hidden">
      {/* Decorative ambient blurred beacon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#FF3B1D]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative z-10 text-center">
        {/* Subtitle / Availability Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#111110]/10 shadow-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF3B1D] animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#111110]">
            DISPONIBILITÉS : 2 CRÉNEAUX EN PRODUCTION Q3/Q4
          </span>
        </motion.div>

        {/* Monumental Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#111110] leading-[0.92] max-w-5xl mx-auto mb-10"
        >
          VOUS AVEZ UNE VISION SANS ÉQUIVALENT ?{" "}
          <span className="text-[#FF3B1D]">CONSTRUISONS L&apos;INÉDIT.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-xl text-[#6E6E6A] max-w-2xl mx-auto leading-relaxed mb-14"
        >
          De la première étincelle conceptuelle au déploiement d&apos;expériences mondiales, nous nous engageons avec passion à vos côtés.
        </motion.p>

        {/* Ambitious Main CTA Button with Magnetic Liquid Fill & Dual-Layer Roll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Magnetic strength={0.4}>
            <a
              href="mailto:hello@lumora.studio?subject=Nouveau%20Projet%20avec%20LUMORA"
              onMouseEnter={() => {
                setIsHovered(true);
                setCursor("pointer");
              }}
              onMouseLeave={() => {
                setIsHovered(false);
                resetCursor();
              }}
              className="group relative inline-flex items-center justify-center px-10 py-6 sm:px-14 sm:py-7 rounded-full bg-[#111110] text-white overflow-hidden shadow-2xl shadow-[#111110]/20 transition-all duration-300 focus:outline-none"
            >
              {/* Expanding Liquid Fill Background Circle */}
              <motion.span
                className="absolute w-72 h-72 rounded-full bg-[#FF3B1D] pointer-events-none -z-0"
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 2.6 : 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Text Content with Rolling Stagger Effect */}
              <div className="relative z-10 flex items-center gap-4 text-sm sm:text-base font-black tracking-widest uppercase">
                <span className="overflow-hidden h-5 inline-block">
                  <motion.span
                    animate={{ y: isHovered ? "-100%" : "0%" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    INITIALISER LE PROJET
                  </motion.span>
                  <motion.span
                    animate={{ y: isHovered ? "-100%" : "0%" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-white"
                  >
                    DÉMARRER MAINTENANT
                  </motion.span>
                </span>

                {/* Animated Arrow Badge */}
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#111110] text-sm transition-transform duration-500 ease-out group-hover:rotate-45 group-hover:bg-[#111110] group-hover:text-white">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </div>
            </a>
          </Magnetic>

          {/* Magnetic Copy Email Pill */}
          <Magnetic strength={0.3}>
            <button
              onClick={handleCopyEmail}
              onMouseEnter={() => setCursor("pointer")}
              onMouseLeave={resetCursor}
              className="inline-flex items-center gap-3 px-8 py-6 rounded-full border border-[#111110]/15 bg-white text-xs font-mono font-bold tracking-wider text-[#111110] hover:border-[#111110] transition-colors duration-200 shadow-sm focus:outline-none"
            >
              <span>{copied ? "ADRESSE COPIÉE !" : "HELLO@LUMORA.STUDIO"}</span>
              <span className="text-[#FF3B1D] flex items-center justify-center">
                {copied ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 stroke-[2]" />
                )}
              </span>
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
