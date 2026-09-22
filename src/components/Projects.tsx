"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useCursor } from "./CustomCursor";

interface Project {
  id: string;
  title: string;
  category: "BRANDING" | "DIGITAL 3D" | "E-COMMERCE" | "SPATIAL";
  categoryLabel: string;
  client: string;
  year: string;
  description: string;
  tags: string[];
  imageUrl: string;
  aspect: "portrait" | "landscape";
}

const CATEGORIES = ["TOUS", "BRANDING", "DIGITAL 3D", "E-COMMERCE", "SPATIAL"] as const;

const PROJECTS: Project[] = [
  {
    id: "aura-kinetics",
    title: "AURA KINETICS",
    category: "DIGITAL 3D",
    categoryLabel: "Interface 3D & Audio Spatial",
    client: "Teenage Engineering Labs",
    year: "2026",
    description: "Système de synthèse sonore interactif explorant la physique de résonance haptique en temps réel.",
    tags: ["Creative Dev", "WebGL", "Audio Reactive"],
    imageUrl:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    aspect: "landscape",
  },
  {
    id: "chronos-polaris",
    title: "CHRONOS POLARIS",
    category: "E-COMMERCE",
    categoryLabel: "Horlogerie Expérimentale",
    client: "Zenith Chronometry",
    year: "2025",
    description: "Plateforme e-commerce cinématique réinventant l'art de la haute horlogerie contemporaine.",
    tags: ["Art Direction", "Next.js", "Design System"],
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    aspect: "portrait",
  },
  {
    id: "neura-spatial",
    title: "NEURA SPATIAL",
    category: "SPATIAL",
    categoryLabel: "Expérience Électrique Conectée",
    client: "Polestar Mobility",
    year: "2026",
    description: "Cockpit numérique épuré et visualisations télémétriques 3D pour véhicules autonomes.",
    tags: ["Spatial UI", "Three.js", "Human-Machine Interface"],
    imageUrl:
      "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80",
    aspect: "portrait",
  },
  {
    id: "solaris-archive",
    title: "SOLARIS ARCHIVE",
    category: "BRANDING",
    categoryLabel: "Identité & Typographie Radicale",
    client: "Fondation d'Art Moderne",
    year: "2025",
    description: "Caractère typographique sur mesure et système d'archives pour collections d'avant-garde.",
    tags: ["Custom Typeface", "Visual Identity", "Editorial"],
    imageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    aspect: "landscape",
  },
  {
    id: "vortex-audio",
    title: "VORTEX MONOLITH",
    category: "DIGITAL 3D",
    categoryLabel: "Hardware & Expérience Tactile",
    client: "Bang & Olufsen Acoustic",
    year: "2026",
    description: "Enceinte sculpturale connectée et compagnon logiciel avec contrôle gyroscopique fluide.",
    tags: ["Industrial UI", "Motion 3D", "Micro-Interactions"],
    imageUrl:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
    aspect: "landscape",
  },
  {
    id: "kinetic-pavilion",
    title: "PAVILION OMEGA",
    category: "SPATIAL",
    categoryLabel: "Installation Architecturale Vivante",
    client: "Biennale d'Architecture",
    year: "2025",
    description: "Structure cinétique réagissant en temps réel aux flux thermiques et sonores des visiteurs.",
    tags: ["Generative Art", "Sensors", "Physical Computing"],
    imageUrl:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    aspect: "portrait",
  },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>("TOUS");
  const { setCursor, resetCursor } = useCursor();

  const filteredProjects =
    activeCategory === "TOUS"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 sm:py-36 bg-[#FAFAF8] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 sm:mb-20 pb-8 border-b border-[#111110]/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#FF3B1D] block mb-4">
              [ 03 // PROJETS SÉLECTIONNÉS ]
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#111110] leading-[0.95]">
              ŒUVRES RÉCENTES & RÉSULTATS TANGIBLES.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#6E6E6A] max-w-md font-normal leading-relaxed">
            Une sélection rigoureuse de projets où l&apos;audace conceptuelle rencontre une exécution technique sans concession.
          </p>
        </div>

        {/* Category Filters with Animated Layout Pill */}
        <div className="flex flex-wrap items-center gap-2 mb-12 sm:mb-16">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="relative px-5 py-2.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider transition-colors duration-200 focus:outline-none"
                onMouseEnter={() => setCursor("pointer")}
                onMouseLeave={resetCursor}
              >
                {isActive && (
                  <motion.span
                    layoutId="category-active-pill"
                    className="absolute inset-0 rounded-full bg-[#111110] -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <span className={isActive ? "text-white" : "text-[#111110] hover:text-[#FF3B1D]"}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid with Cascade Stagger & Scale/Rotation on Entrance */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const initialRotation = index % 2 === 0 ? -1.5 : 1.5;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 60,
                    scale: 0.95,
                    rotate: initialRotation,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.75,
                    delay: (index % 2) * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onMouseEnter={() => setCursor("project", "VIEW")}
                  onMouseLeave={resetCursor}
                  className="group flex flex-col justify-between rounded-3xl bg-white p-5 sm:p-7 border border-[#111110]/8 shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] hover:border-[#FF3B1D]/40 transition-all duration-500"
                >
                  {/* Image Container with Zoom Effect on Hover */}
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-[#E8E8E4] mb-6">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${project.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Top Right Project Tag */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="font-mono text-[11px] font-bold tracking-widest text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full uppercase">
                        {project.year}
                      </span>
                    </div>

                    {/* Floating Bottom Left Badge on Hover */}
                    <div className="absolute bottom-4 left-4 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-xs font-mono font-bold tracking-wider text-white bg-[#FF3B1D] px-3.5 py-1.5 rounded-full uppercase shadow-lg shadow-[#FF3B1D]/40">
                        {project.client}
                      </span>
                    </div>
                  </div>

                  {/* Project Metadata */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#FF3B1D] font-bold">
                        {project.categoryLabel}
                      </span>
                      <span className="text-[#111110] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111110] group-hover:text-[#FF3B1D] transition-colors duration-300 mb-2">
                      {project.title}
                    </h3>

                    <p className="text-sm text-[#6E6E6A] leading-relaxed mb-6 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[#111110]/6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FAFAF8] text-[#111110]/70 border border-[#111110]/6"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
