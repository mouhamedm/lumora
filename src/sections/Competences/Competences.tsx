import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Competences.css";

import reactIcon from "../../assets/icons/react.svg";
import nextjsIcon from "../../assets/icons/nextjs.svg";
import typescriptIcon from "../../assets/icons/typescript.svg";
import tailwindIcon from "../../assets/icons/tailwind.svg";
import flutterIcon from "../../assets/icons/flutter.svg";
import javascriptIcon from "../../assets/icons/javascript.svg";
import html5Icon from "../../assets/icons/html5.svg";
import css3Icon from "../../assets/icons/css3.svg";
import gitIcon from "../../assets/icons/git.svg";
import figmaIcon from "../../assets/icons/figma.svg";
import vscodeIcon from "../../assets/icons/vscode.svg";
import githubIcon from "../../assets/icons/github.svg";
import nodejsIcon from "../../assets/icons/nodejs.svg";
import firebaseIcon from "../../assets/icons/firebase.svg";

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  { name: "React", color: "#61DAFB", size: "large", icon: reactIcon },
  { name: "Next.js", color: "#FFFFFF", size: "large", icon: nextjsIcon },
  { name: "TypeScript", color: "#3178C6", size: "medium", icon: typescriptIcon },
  { name: "Tailwind CSS", color: "#38B2AC", size: "medium", icon: tailwindIcon },
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

export default function Competences() {
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
      "(prefers-reduced-motion: reduce)"
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
                    toggleActions: "play pause resume pause"
                  }
                });
              });
            },
          }
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

  return (
    <section className="competences" id="competences" ref={sectionRef}>
      <div className="competences__container">
        <div className="competences__header">
          <div className="competences__eyebrow" aria-hidden="true">
            {t("skills.eyebrow")}
          </div>
          <h2 className="competences__title" ref={titleRef}>
            {t("skills.title_start")}
            <span className="highlight">{t("skills.title_highlight")}</span>
          </h2>
          <p className="competences__subtitle">{t("skills.subtitle")}</p>
        </div>

        <div className="bento-grid">
          {/* Frontend & Mobile Box */}
          <div className="bento-box bento-box--frontend">
            <h3 className="bento-box__title">{t("skills.frontend_title")}</h3>
            <div className="competences__grid">
              {techStack.map((tech, index) => (
                <div
                  key={tech.name}
                  className={`tech-card tech-card--${tech.size}`}
                  ref={(el) => {
                    allCardsRef.current[index] = el;
                  }}
                  style={{ "--tech-color": tech.color } as React.CSSProperties}
                >
                  <div className="tech-card__glow" />
                  <div className="tech-card__content">
                    <img src={tech.icon} alt={tech.name} className="tech-card__icon" />
                    <span className="tech-card__name">{tech.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-grid__column">
            {/* Backend Box */}
            <div className="bento-box bento-box--backend">
              <h3 className="bento-box__title">{t("skills.backend_title")}</h3>
              <div className="competences__grid">
                {backendStack.map((tech, index) => (
                  <div
                    key={tech.name}
                    className={`tech-card tech-card--${tech.size}`}
                    ref={(el) => {
                      allCardsRef.current[techStack.length + index] = el;
                    }}
                    style={{ "--tech-color": tech.color } as React.CSSProperties}
                  >
                    <div className="tech-card__glow" />
                    <div className="tech-card__content">
                      <img src={tech.icon} alt={tech.name} className="tech-card__icon" />
                      <span className="tech-card__name">{tech.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools Box */}
            <div className="bento-box bento-box--tools">
              <h3 className="bento-box__title">{t("skills.tools_title")}</h3>
              <div className="competences__grid">
                {toolsStack.map((tech, index) => (
                  <div
                    key={tech.name}
                    className={`tech-card tech-card--${tech.size}`}
                    ref={(el) => {
                      allCardsRef.current[techStack.length + backendStack.length + index] = el;
                    }}
                    style={{ "--tech-color": tech.color } as React.CSSProperties}
                  >
                    <div className="tech-card__glow" />
                    <div className="tech-card__content">
                      <img src={tech.icon} alt={tech.name} className="tech-card__icon" />
                      <span className="tech-card__name">{tech.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
