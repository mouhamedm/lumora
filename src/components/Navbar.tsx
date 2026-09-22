"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { useCursor } from "./CustomCursor";

const NAV_LINKS = [
  { name: "Services", href: "#services" },
  { name: "Projets", href: "#projects" },
  { name: "Manifesto", href: "#manifesto" },
  { name: "Chiffres", href: "#stats" },
  { name: "Témoignages", href: "#testimonials" },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-3 bg-lumora-bg/85 backdrop-blur-xl border-b border-lumora-dark/8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Logo with magnetic attraction */}
          <Magnetic strength={0.25}>
            <a
              href="#"
              className="group flex items-center gap-2.5 text-2xl font-black tracking-tighter uppercase text-lumora-dark focus:outline-none"
              onMouseEnter={() => setCursor("pointer")}
              onMouseLeave={resetCursor}
            >
              <span className="relative">
                LUMORA
                <span className="inline-block w-2 h-2 rounded-full bg-lumora-accent ml-1 mb-1 animate-pulse" />
              </span>
              <span className="hidden lg:inline-block text-[10px] font-mono font-medium tracking-widest text-lumora-muted px-2 py-0.5 rounded-full border border-lumora-dark/10 ml-2">
                EDITION {new Date().getFullYear()}
              </span>
            </a>
          </Magnetic>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1 bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-lumora-dark/8 shadow-sm"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {NAV_LINKS.map((link, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <Magnetic key={link.name} strength={0.3}>
                  <a
                    href={link.href}
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      setCursor("pointer");
                    }}
                    onMouseLeave={resetCursor}
                    className="relative px-4 py-2 text-xs font-semibold uppercase tracking-wider text-lumora-dark transition-colors duration-200 block"
                  >
                    {/* Fluid Pill indicator */}
                    {isHovered && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-lumora-dark -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-200 ${
                        isHovered ? "text-white" : "text-lumora-dark"
                      }`}
                    >
                      {link.name}
                    </span>
                  </a>
                </Magnetic>
              );
            })}
          </nav>

          {/* Right Action CTA (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Magnetic strength={0.35}>
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-lumora-dark px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-lg hover:shadow-lumora-accent/20 focus:outline-none"
                onMouseEnter={() => setCursor("pointer")}
                onMouseLeave={resetCursor}
              >
                {/* Liquid Fill hover circle */}
                <span className="absolute inset-0 translate-y-full rounded-full bg-lumora-accent transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative z-10">Lancer un Projet</span>
                <span className="relative z-10 flex h-4 w-4 items-center justify-center rounded-full bg-white text-lumora-dark transition-transform duration-300 group-hover:rotate-45 group-hover:bg-lumora-dark group-hover:text-white">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                </span>
              </a>
            </Magnetic>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="relative z-50 flex h-11 w-11 flex-col items-center justify-center rounded-full bg-white border border-lumora-dark/10 shadow-sm focus:outline-none"
            >
              <motion.span
                animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="h-0.5 w-5 bg-lumora-dark rounded-full"
              />
              <motion.span
                animate={mobileMenuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="my-1 h-0.5 w-5 bg-lumora-dark rounded-full"
              />
              <motion.span
                animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="h-0.5 w-5 bg-lumora-dark rounded-full"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-lumora-bg px-8 pt-28 pb-10 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <span className="text-[11px] font-mono tracking-widest uppercase text-lumora-muted">
                Menu de navigation
              </span>
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.06, duration: 0.4 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-baseline justify-between py-2 text-3xl font-black uppercase tracking-tight text-lumora-dark hover:text-lumora-accent transition-colors"
                    >
                      <span>{link.name}</span>
                      <span className="text-xs font-mono text-lumora-muted group-hover:text-lumora-accent">
                        0{idx + 1}
                      </span>
                    </a>
                  </motion.div>
                ))}
              </nav>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-col gap-5 pt-6 border-t border-lumora-dark/10"
            >
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-lumora-dark text-white font-bold text-sm tracking-wider uppercase"
              >
                <span>Démarrer un projet</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
              <div className="flex items-center justify-between text-xs text-lumora-muted">
                <span>Paris • Tokyo • NYC</span>
                <span className="font-mono">hello@lumora.studio</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
