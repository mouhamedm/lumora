"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useCursor } from "./CustomCursor";

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  headline: string;
  description: string;
  tags: string[];
  deliverable: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: "art-direction",
    number: "01",
    title: "Direction Artistique & Image",
    headline: "Identités souveraines & grammaires visuelles distinctives",
    description:
      "Nous sculptons l'ADN visuel des marques pionnières : logos manifestes, typographies sur mesure, systèmes de design pérennes et direction photographique éditoriale.",
    tags: ["Brand Identity", "Custom Type", "Art Direction", "Packaging"],
    deliverable: "Playbook de marque complet & Guidelines",
  },
  {
    id: "creative-dev",
    number: "02",
    title: "Ingénierie Créative & WebGL",
    headline: "Expériences web immersives & micro-interactions tactiles",
    description:
      "Architecture Next.js haute performance, shaders cinématiques, physique de ressorts organiques et transitions sans couture au service d'un storytelling mémorable.",
    tags: ["Creative Coding", "WebGL & Three", "Next.js Architecture", "60 FPS Motion"],
    deliverable: "Codebase moderne & Score Core Web Vitals 100%",
  },
  {
    id: "motion-3d",
    number: "03",
    title: "Motion Design 3D & CGI",
    headline: "Simulations sculpturales & typographies en apesanteur",
    description:
      "Création de films de marque captivants, animations de produits photoréalistes, kinetic typography et univers virtuels qui marquent instantanément les esprits.",
    tags: ["3D Animation", "CGI Visuals", "Kinetic Typography", "Sound Identity"],
    deliverable: "Rendus 4K Broadcast & Formats Réseaux",
  },
  {
    id: "product-design",
    number: "04",
    title: "Expérience Produit & Stratégie",
    headline: "Systèmes de composants scalables & interfaces fluides",
    description:
      "Conception UX/UI rigoureuse, wireframes obsessionnels, prototypes haute fidélité et bibliothèques de composants prêtes pour la production à grande échelle.",
    tags: ["UI/UX Systems", "Design Tokens", "Prototypage", "Product Strategy"],
    deliverable: "Bibliothèque Figma & Design Tokens tokens.json",
  },
];

export default function Services() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { setCursor, resetCursor } = useCursor();

  return (
    <section id="services" className="py-24 sm:py-36 bg-[#FAFAF8] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 sm:mb-24 pb-8 border-b border-[#111110]/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF3B1D] block mb-4">
              [ 01 // NOS EXPERTISES ]
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#111110] max-w-2xl leading-[0.95]">
              CE QUE NOUS FORGEONS AVEC PRÉCISION.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#6E6E6A] max-w-md font-normal leading-relaxed">
            Chaque marque porte une intensité singulière. Notre rôle est de l&apos;amplifier à travers des systèmes esthétiques radicaux et des interactions numériques inoubliables.
          </p>
        </div>

        {/* Staggered Cards Grid with Scale & Subtle Rotation on Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {SERVICES.map((service, index) => {
            const isHovered = hoveredCard === service.id;
            // Alternating subtle initial rotation
            const initialRotation = index % 2 === 0 ? -1.8 : 1.8;

            return (
              <motion.div
                key={service.id}
                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.95,
                  rotate: initialRotation,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => {
                  setHoveredCard(service.id);
                  setCursor("pointer");
                }}
                onMouseLeave={() => {
                  setHoveredCard(null);
                  resetCursor();
                }}
                className={`group relative rounded-3xl p-8 sm:p-10 transition-all duration-500 flex flex-col justify-between border ${
                  isHovered
                    ? "bg-white border-[#FF3B1D]/40 shadow-[0_24px_50px_rgba(255,59,29,0.06)] -translate-y-2"
                    : "bg-white/80 border-[#111110]/8 shadow-sm hover:border-[#111110]/20"
                }`}
              >
                {/* Top Row: Index and Electric Indicator */}
                <div>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#111110]/6">
                    <span className="text-sm font-mono font-bold tracking-widest text-[#FF3B1D]">
                      {service.number}
                    </span>
                    <span
                      className={`text-xs font-mono tracking-wider uppercase transition-colors duration-300 ${
                        isHovered ? "text-[#FF3B1D]" : "text-[#6E6E6A]"
                      }`}
                    >
                      {service.deliverable}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111110] group-hover:text-[#FF3B1D] transition-colors duration-300 mb-3">
                    {service.title}
                  </h3>

                  <h4 className="text-sm sm:text-base font-semibold text-[#111110]/80 mb-4">
                    {service.headline}
                  </h4>

                  <p className="text-sm sm:text-base text-[#6E6E6A] leading-relaxed mb-8">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Tags */}
                <div className="pt-4 border-t border-[#111110]/6 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs font-mono px-3 py-1 rounded-full transition-all duration-300 ${
                          isHovered
                            ? "bg-[#FF3B1D]/10 text-[#FF3B1D] border border-[#FF3B1D]/20"
                            : "bg-[#FAFAF8] text-[#111110]/80 border border-[#111110]/8"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAFAF8] text-[#111110] group-hover:bg-[#FF3B1D] group-hover:text-white transition-all duration-300 shrink-0">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
