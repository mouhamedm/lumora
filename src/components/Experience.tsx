import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Globe2,
  Award,
  Calendar,
  Building2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../lib/utils";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  id: string;
  periodKey: string;
  roleKey: string;
  orgKey: string;
  descKey: string;
  isCurrent?: boolean;
  type: "work" | "education" | "language" | "diploma";
  icon: React.ElementType;
  accentColor: string;
  technologies: string[];
}

const experiences: ExperienceItem[] = [
  {
    id: "freelance",
    periodKey: "experience.freelance_period",
    roleKey: "experience.freelance_role",
    orgKey: "experience.freelance_org",
    descKey: "experience.freelance_desc",
    isCurrent: true,
    type: "work",
    icon: Briefcase,
    accentColor: "#4C8DFF",
    technologies: [
      "React",
      "Next.js",
      "Three.js",
      "GSAP",
      "Tailwind CSS",
      "TypeScript",
      "Firebase",
    ],
  },
  {
    id: "kabakoo",
    periodKey: "experience.kabakoo_period",
    roleKey: "experience.kabakoo_role",
    orgKey: "experience.kabakoo_org",
    descKey: "experience.kabakoo_desc",
    type: "education",
    icon: GraduationCap,
    accentColor: "#38B2AC",
    technologies: [
      "JavaScript ES6+",
      "React Ecosystem",
      "REST APIs",
      "Git & GitHub",
      "Agile/Scrum",
    ],
  },
  {
    id: "celps",
    periodKey: "experience.celps_period",
    roleKey: "experience.celps_role",
    orgKey: "experience.celps_org",
    descKey: "experience.celps_desc",
    type: "language",
    icon: Globe2,
    accentColor: "#A78BFA",
    technologies: [
      "Bilingual Tech Communication",
      "Technical Documentation",
      "International Collaboration",
    ],
  },
  {
    id: "bac",
    periodKey: "experience.bac_period",
    roleKey: "experience.bac_role",
    orgKey: "experience.bac_org",
    descKey: "experience.bac_desc",
    type: "diploma",
    icon: Award,
    accentColor: "#F59E0B",
    technologies: [
      "Mathématiques",
      "Logique Algorithmique",
      "Résolution Analytique",
    ],
  },
];

// Interactive 3D Tilt Card with Holographic Mouse Spotlight
const ExperienceCard: React.FC<{
  item: ExperienceItem;
}> = ({ item }) => {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.matchMedia("(hover: none)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Subtle, buttery 3D tilt calculation
    const rotX = -((y - centerY) / centerY) * 7;
    const rotY = ((x - centerX) / centerX) * 7;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const IconComponent = item.icon;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered
          ? "transform 0.1s ease-out, border-color 0.3s, box-shadow 0.3s"
          : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s, box-shadow 0.3s",
      }}
      className={cn(
        "relative rounded-2xl bg-[rgba(23,23,26,0.75)] border border-white/10 backdrop-blur-xl p-4 sm:p-6 md:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] overflow-hidden cursor-default group",
        item.isCurrent
          ? "border-[rgba(76,141,255,0.35)] shadow-[0_0_30px_rgba(76,141,255,0.15)]"
          : "hover:border-white/20 hover:shadow-[0_20px_45px_rgba(0,0,0,0.7)]",
      )}
    >
      {/* Holographic Radial Mouse Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(76,141,255,0.18), transparent 80%)`,
        }}
      />

      {/* Top ambient color glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none translate-z-0 transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: item.accentColor }}
      />

      {/* Card Header: Role & Period */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${item.accentColor}18`,
              borderColor: `${item.accentColor}40`,
              color: item.accentColor,
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg md:text-xl font-bold text-white group-hover:text-[var(--accent)] transition-colors duration-300">
              {t(item.roleKey)}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t(item.orgKey)}</span>
            </div>
          </div>
        </div>

        {/* Period Badge */}
        <div className="flex items-center gap-2">
          {item.isCurrent && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-3.5" />
              {t("experience.present")}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-[var(--font-mono)] bg-white/5 border border-white/10 text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            {t(item.periodKey)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 font-[var(--font-body)] text-sm md:text-base text-zinc-300 leading-relaxed mb-6">
        {t(item.descKey)}
      </p>

      {/* Technologies / Skills Tags */}
      <div className="relative z-10 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
        {item.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-lg text-xs font-[var(--font-mono)] bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5 transition-all duration-200"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function Experience() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const progressLineMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

    const ctx = gsap.context(() => {
      // Eyebrow entrance
      gsap.fromTo(
        ".experience-eyebrow",
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

      // Scroll-driven timeline line fill
      if (timelineRef.current && progressLineRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 0.6,
            },
          },
        );
      }
      if (timelineRef.current && progressLineMobileRef.current) {
        gsap.fromTo(
          progressLineMobileRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 0.6,
            },
          },
        );
      }

      // Animate each timeline row as it scrolls into view
      const rows = section.querySelectorAll<HTMLElement>(".experience-row");
      rows.forEach((row) => {
        const card = row.querySelector<HTMLElement>(".experience-card-col");
        const node = row.querySelector<HTMLElement>(".experience-node");

        if (card) {
          const isLeft = card.classList.contains("experience-col-left");
          gsap.fromTo(
            card,
            { opacity: 0, x: isLeft ? -50 : 50, scale: 0.95 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.85,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                once: true,
                fastScrollEnd: true,
              },
            },
          );
        }

        if (node) {
          gsap.fromTo(
            node,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: "back.out(1.8)",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                once: true,
                fastScrollEnd: true,
              },
            },
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-16 md:py-32 px-4 sm:px-6 md:px-12 max-w-[1340px] w-full mx-auto overflow-hidden bg-[var(--color-bg-base)]"
    >
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none translate-z-0" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16 md:mb-24">
          <div
            className="experience-eyebrow inline-flex items-center font-[var(--font-mono)] text-xs font-medium tracking-[0.1em] uppercase text-[var(--accent)] mb-4 px-4 py-1.5 bg-[var(--accent-soft)] border border-[rgba(76,141,255,0.2)] rounded-full shadow-[0_0_20px_rgba(76,141,255,0.15)]"
            aria-hidden="true"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 text-[var(--accent)]" />
            {t("experience.eyebrow")}
          </div>
          <h2 className="font-display text-[clamp(38px,4.5vw,64px)] lg:text-[64px] leading-[1.15] font-bold text-white mb-4">
            <TextReveal
              text={t("experience.title_start")}
              type="chars"
              spanClassName="title-glow"
              triggerRef={headerRef}
            />{" "}
            <TextReveal
              text={t("experience.title_highlight")}
              type="chars"
              spanClassName="highlight"
              delay={0.2}
              triggerRef={headerRef}
            />
            {t("experience.title_end") ? (
              <>
                {" "}
                <TextReveal
                  text={t("experience.title_end")}
                  type="chars"
                  delay={0.4}
                  triggerRef={headerRef}
                />
              </>
            ) : null}
          </h2>
          <div className="font-[var(--font-body)] text-sm md:text-base text-[var(--text-secondary)] max-w-[620px] mx-auto leading-relaxed">
            <TextReveal
              text={t("experience.subtitle")}
              type="words"
              delay={0.35}
              triggerRef={headerRef}
            />
          </div>
        </div>

        {/* High-Tech Laser Beam Timeline Layout */}
        <div className="relative w-full max-w-5xl mx-auto" ref={timelineRef}>
          {/* Central Vertical Energy Beam Line (Desktop) */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] overflow-hidden">
            {/* Static ambient track */}
            <div className="w-full h-full bg-white/10" />
            {/* Scroll-driven colored fill */}
            <div
              ref={progressLineRef}
              className="absolute inset-0 origin-top bg-gradient-to-b from-[var(--accent)] via-cyan-400 to-[#1A6FE8] opacity-90 shadow-[0_0_15px_#4c8dff]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {/* Left Line for Mobile & Tablets */}
          <div className="block lg:hidden absolute top-0 bottom-0 left-4 sm:left-6 w-[2px] overflow-hidden">
            <div className="w-full h-full bg-white/10" />
            <div
              ref={progressLineMobileRef}
              className="absolute inset-0 origin-top bg-gradient-to-b from-[var(--accent)] via-cyan-400 to-[#1A6FE8] opacity-90 shadow-[0_0_15px_#4c8dff]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-12 md:space-y-16">
            {experiences.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id}
                  className="experience-row relative flex flex-col lg:flex-row items-center lg:justify-between w-full"
                >
                  {/* Left or Right Column (Desktop) */}
                  <div
                    className={cn(
                      "experience-card-col w-full lg:w-[calc(50%-48px)]",
                      isEven ? "experience-col-left lg:order-1" : "experience-col-right lg:order-2",
                      "pl-9 sm:pl-16 lg:pl-0",
                    )}
                  >
                    <ExperienceCard item={item} />
                  </div>

                  {/* Center Node / Orbital Reactor (Desktop) */}
                  <div className="experience-node hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20">
                    <div
                      className={cn(
                        "relative w-12 h-12 rounded-full border flex items-center justify-center bg-[#0e1017] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)]",
                        item.isCurrent
                          ? "border-[var(--accent)] shadow-[0_0_25px_rgba(76,141,255,0.6)]"
                          : "border-white/20 hover:border-[var(--accent)]",
                      )}
                    >
                      {item.isCurrent && (
                        <div className="absolute inset-0 rounded-full bg-[var(--accent)]/20 animate-ping" />
                      )}
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.accentColor }}
                      />
                    </div>
                  </div>

                  {/* Mobile Node */}
                  <div className="experience-node lg:hidden absolute left-4 sm:left-6 -translate-x-1/2 top-7 sm:top-8 z-20">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--accent)] bg-[#0e1017] flex items-center justify-center shadow-[0_0_15px_rgba(76,141,255,0.5)]"
                    >
                      <div
                        className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full"
                        style={{ backgroundColor: item.accentColor }}
                      />
                    </div>
                  </div>

                  {/* Spacer for the other side (Desktop) */}
                  <div
                    className={cn(
                      "hidden lg:block lg:w-[calc(50%-48px)]",
                      isEven ? "lg:order-2" : "lg:order-1",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
