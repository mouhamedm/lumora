"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import Magnetic from "./Magnetic";
import { useCursor } from "./CustomCursor";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  year: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const PREV_YEAR = CURRENT_YEAR - 1;

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    quote:
      "LUMORA ne se contente pas de livrer une vitrine : ils ont magnifié notre identité avec une virtuosité technique et une intensité plastique qui ont subjugué notre communauté mondiale.",
    author: "Elena Rostova",
    role: "Directrice Créative Globale",
    company: "Vortex Sound & Acoustic",
    year: `${CURRENT_YEAR}`,
  },
  {
    id: 2,
    quote:
      "Leur maîtrise de la physique de ressorts, de la typographie sculpturale et de la 3D temps réel a redéfini notre standard de luxe numérique. Un partenariat d'une rareté absolue.",
    author: "Marcus Vance",
    role: "VP Digital Experience",
    company: "Polestar Mobility",
    year: `${PREV_YEAR}`,
  },
  {
    id: 3,
    quote:
      "Des partis-pris esthétiques sans compromis alliés à des performances de chargement instantanées. Notre taux d'engagement a bondi de 340% dès les 30 premiers jours de mise en ligne.",
    author: "Clara d'Orsay",
    role: "Directrice de l'Innovation",
    company: "Zenith Horlogerie",
    year: `${CURRENT_YEAR}`,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setCursor, resetCursor } = useCursor();

  const current = TESTIMONIALS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-24 sm:py-36 bg-lumora-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 sm:mb-24 pb-8 border-b border-lumora-dark/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-lumora-accent block mb-4">
              [ 05 // LA VOIX DE NOS PARTENAIRES ]
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-lumora-dark max-w-2xl leading-[0.95]">
              PAROLES DE VISIONNAIRES.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-lumora-muted max-w-md font-normal leading-relaxed">
            Nous collaborons exclusivement avec des marques qui osent bousculer les conventions de leur industrie.
          </p>
        </div>

        {/* Testimonial Showcase */}
        <div className="relative rounded-3xl bg-white p-8 sm:p-16 md:p-20 border border-lumora-dark/8 shadow-sm">
          {/* Quotation icon */}
          <Quote className="w-10 h-10 text-lumora-accent/30 mb-6 stroke-[1.75]" />

          <div className="min-h-55 sm:min-h-45 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <p className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-lumora-dark leading-snug sm:leading-tight mb-8">
                  {current.quote}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-lumora-dark/8">
                  <div>
                    <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-lumora-dark">
                      {current.author}
                    </h4>
                    <p className="text-xs sm:text-sm font-mono text-lumora-muted">
                      {current.role} — <span className="text-lumora-accent font-bold">{current.company}</span>
                    </p>
                  </div>
                  <span className="text-xs font-mono text-lumora-muted bg-lumora-bg px-3 py-1 rounded-full border border-lumora-dark/6">
                    COLLABORATION {current.year}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-lumora-dark/6">
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 transition-all duration-300 rounded-full focus:outline-none ${
                    currentIndex === idx ? "w-8 bg-lumora-accent" : "w-2 bg-lumora-dark/20 hover:bg-lumora-dark/40"
                  }`}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                  onMouseEnter={() => setCursor("pointer")}
                  onMouseLeave={resetCursor}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Magnetic strength={0.3}>
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border border-lumora-dark/15 flex items-center justify-center text-lumora-dark hover:bg-lumora-dark hover:text-white hover:border-lumora-dark transition-colors duration-200 focus:outline-none"
                  aria-label="Témoignage précédent"
                  onMouseEnter={() => setCursor("pointer")}
                  onMouseLeave={resetCursor}
                >
                  <ArrowLeft className="w-4 h-4 stroke-2" />
                </button>
              </Magnetic>

              <Magnetic strength={0.3}>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-lumora-dark/15 flex items-center justify-center text-lumora-dark hover:bg-lumora-dark hover:text-white hover:border-lumora-dark transition-colors duration-200 focus:outline-none"
                  aria-label="Témoignage suivant"
                  onMouseEnter={() => setCursor("pointer")}
                  onMouseLeave={resetCursor}
                >
                  <ArrowRight className="w-4 h-4 stroke-2" />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
