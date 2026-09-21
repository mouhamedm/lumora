import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";

import reactIcon from "../assets/icons/react.svg";
import nextjsIcon from "../assets/icons/nextjs.svg";
import typescriptIcon from "../assets/icons/typescript.svg";
import tailwindIcon from "../assets/icons/tailwind.svg";
import flutterIcon from "../assets/icons/flutter.svg";
import javascriptIcon from "../assets/icons/javascript.svg";
import html5Icon from "../assets/icons/html5.svg";
import css3Icon from "../assets/icons/css3.svg";
import gitIcon from "../assets/icons/git.svg";
import figmaIcon from "../assets/icons/figma.svg";
import vscodeIcon from "../assets/icons/vscode.svg";
import githubIcon from "../assets/icons/github.svg";
import nodejsIcon from "../assets/icons/nodejs.svg";
import firebaseIcon from "../assets/icons/firebase.svg";

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  { name: "React", color: "#61DAFB", size: "large", icon: reactIcon },
  { name: "Next.js", color: "#FFFFFF", size: "large", icon: nextjsIcon },
  {
    name: "TypeScript",
    color: "#3178C6",
    size: "medium",
    icon: typescriptIcon,
  },
  {
    name: "Tailwind CSS",
    color: "#38B2AC",
    size: "medium",
    icon: tailwindIcon,
  },
  { name: "Flutter/Dart", color: "#02569B", size: "medium", icon: flutterIcon },
  { name: "JavaScript", color: "#F7DF1E", size: "small", icon: javascriptIcon },
  { name: "HTML5", color: "#E34F26", size: "small", icon: html5Icon },
  { name: "CSS3", color: "#1572B6", size: "small", icon: css3Icon },
];

const backendStack = [
  { name: "Node.js", color: "#339933", size: "medium", icon: nodejsIcon },
  { name: "Firebase", color: "#FFCA28", size: "medium", icon: firebaseIcon },
];

const toolsStack = [
  { name: "Git", color: "#F05032", size: "small", icon: gitIcon },
  { name: "Figma", color: "#F24E1E", size: "small", icon: figmaIcon },
  { name: "VS Code", color: "#007ACC", size: "small", icon: vscodeIcon },
  { name: "GitHub", color: "#FFFFFF", size: "small", icon: githubIcon },
];

// Size → height + flex basis mapping
const sizeClasses: Record<string, string> = {
  large: "flex-[1_1_calc(50%-8px)] h-[120px]",
  medium: "flex-[1_1_calc(33.333%-11px)] h-[110px]",
  small: "flex-[1_1_calc(50%-8px)] h-[100px]",
};

const sizeIconClasses: Record<string, string> = {
  large: "w-12 h-12",
  medium: "w-10 h-10",
  small: "w-10 h-10",
};

export default function Skills() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const allCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = allCardsRef.current.filter(Boolean) as HTMLDivElement[];
    const title = titleRef.current;

    if (!section || !title || cards.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      // Title Animation
      gsap.fromTo(
        title,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        },
      );

      // Cards Entrance Animation per Bento Box
      const boxes = gsap.utils.toArray(".bento-box") as HTMLDivElement[];

      boxes.forEach((box) => {
        const boxCards = box.querySelectorAll(".tech-card");

        gsap.fromTo(
          boxCards,
          { opacity: 0, scale: 0.8, y: 80, rotationX: 45 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
            ease: "back.out(1.5)",
            stagger: 0.1,
            scrollTrigger: {
              trigger: box,
              start: "top 85%",
            },
            onComplete: () => {
              if (prefersReducedMotion) return;

              // Continuous Floating Animation
              boxCards.forEach((card, i) => {
                gsap.to(card, {
                  y: "+=15",
                  rotationZ: i % 2 === 0 ? 2 : -2,
                  duration: 2 + i * 0.2,
                  ease: "sine.inOut",
                  yoyo: true,
                  repeat: -1,
                  delay: Math.random() * 0.5,
                  scrollTrigger: {
                    trigger: box,
                    start: "top bottom",
                    end: "bottom top",
                    toggleActions: "play pause resume pause",
                  },
                });
              });
            },
          },
        );
      });
    }, sectionRef);

    if (prefersReducedMotion) return () => ctx.revert();

    // Parallax effect on mouse move
    const setters = cards.map((card, i) => ({
      x: gsap.quickTo(card, "x", { duration: 0.8, ease: "power3.out" }),
      y: gsap.quickTo(card, "y", { duration: 0.8, ease: "power3.out" }),
      strength: ((i % 3) + 1) * 6,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      setters.forEach((setter) => {
        setter.x(relX * setter.strength);
        setter.y(relY * setter.strength);
      });
    };

    const handleMouseLeave = () => {
      setters.forEach((setter) => {
        setter.x(0);
        setter.y(0);
      });
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
      ctx.revert();
    };
  }, []);

  const renderTechCard = (
    tech: (typeof techStack)[number],
    globalIndex: number,
  ) => (
    <div
      key={tech.name}
      className={`tech-card group tech-card-shimmer relative bg-[rgba(23,23,26,0.6)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.05)] rounded-[20px] flex items-center justify-center p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] [transform-style:preserve-3d] will-change-transform transition-[border-color,box-shadow] duration-[400ms] cursor-default hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7),0_0_20px_rgba(255,255,255,0.05)] ${sizeClasses[tech.size]} max-[768px]:flex-[1_1_calc(50%-8px)] max-[768px]:h-[100px]`}
      ref={(el) => {
        allCardsRef.current[globalIndex] = el;
      }}
      style={{ "--tech-color": tech.color } as React.CSSProperties}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-[inherit] opacity-0 [filter:blur(20px)] transition-opacity duration-[400ms] z-0 group-hover:opacity-[0.15]"
        style={{
          background: `radial-gradient(circle at center, ${tech.color} 0%, transparent 70%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-[1] flex flex-col items-center gap-3">
        <img
          src={tech.icon}
          alt={tech.name}
          className={`object-contain [filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.5))] transition-transform duration-300 hover:translate-y-[-4px] hover:scale-110 ${sizeIconClasses[tech.size]} max-[768px]:w-8 max-[768px]:h-8`}
        />
        <span className="font-semibold text-base text-white transition-colors duration-300 max-[768px]:text-sm">
          {tech.name}
        </span>
      </div>
    </div>
  );

  return (
    <section
      className="competences relative py-[120px] px-12 max-w-[1280px] w-full mx-auto min-h-[80vh] flex items-center justify-center overflow-hidden max-[768px]:py-[100px] max-[768px]:px-6"
      id="skills"
      ref={sectionRef}
    >
      <div className="w-full flex flex-col items-center z-[2]">
        {/* Header */}
        <div className="text-center mb-20">
          <div
            className="inline-flex items-center font-[var(--font-mono)] text-xs font-medium tracking-[0.1em] uppercase text-[var(--accent)] mb-6 px-4 py-1.5 bg-[var(--accent-soft)] border border-[rgba(76,141,255,0.2)] rounded-full shadow-[0_0_20px_rgba(76,141,255,0.15)]"
            aria-hidden="true"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 text-[var(--accent)]" />
            {t("skills.eyebrow")}
          </div>
          <h2
            className="competences__title font-display text-[clamp(36px,4vw,64px)] lg:text-[64px] leading-[1.1] font-bold mb-4"
            ref={titleRef}
          >
            <span className="title-glow">{t("skills.title_start")}</span>
            <span className="highlight">{t("skills.title_highlight")}</span>
          </h2>
          <p className="text-[clamp(16px,2vw,18px)] text-[var(--text-secondary)] max-w-[600px] mx-auto">
            {t("skills.subtitle")}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-[1.2fr_1fr] gap-8 w-full max-w-[1100px] mx-auto max-[1024px]:grid-cols-1 max-[768px]:gap-6">
          {/* Frontend & Mobile Box */}
          <div className="bento-box bg-[rgba(23,23,26,0.3)] border border-[rgba(255,255,255,0.05)] rounded-[32px] p-8 flex flex-col max-[768px]:p-6">
            <h3 className="text-[20px] font-semibold text-[var(--text-secondary)] mb-6 text-left">
              {t("skills.frontend_title")}
            </h3>
            <div className="flex flex-wrap gap-4">
              {techStack.map((tech, index) => renderTechCard(tech, index))}
            </div>
          </div>

          <div className="flex flex-col gap-8 max-[768px]:gap-6">
            {/* Backend Box */}
            <div className="bento-box bg-[rgba(23,23,26,0.3)] border border-[rgba(255,255,255,0.05)] rounded-[32px] p-8 flex flex-col max-[768px]:p-6">
              <h3 className="text-[20px] font-semibold text-[var(--text-secondary)] mb-6 text-left">
                {t("skills.backend_title")}
              </h3>
              <div className="flex flex-wrap gap-4">
                {backendStack.map((tech, index) =>
                  renderTechCard(tech, techStack.length + index),
                )}
              </div>
            </div>

            {/* Tools Box */}
            <div className="bento-box bg-[rgba(23,23,26,0.3)] border border-[rgba(255,255,255,0.05)] rounded-[32px] p-8 flex flex-col max-[768px]:p-6">
              <h3 className="text-[20px] font-semibold text-[var(--text-secondary)] mb-6 text-left">
                {t("skills.tools_title")}
              </h3>
              <div className="flex flex-wrap gap-4">
                {toolsStack.map((tech, index) =>
                  renderTechCard(
                    tech,
                    techStack.length + backendStack.length + index,
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
