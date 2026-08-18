import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Competences.css";

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  { name: "React", color: "#61DAFB", size: "large" },
  { name: "Next.js", color: "#FFFFFF", size: "large" },
  { name: "TypeScript", color: "#3178C6", size: "medium" },
  { name: "Tailwind CSS", color: "#38B2AC", size: "medium" },
  { name: "Flutter/Dart", color: "#02569B", size: "medium" },
  { name: "JavaScript", color: "#F7DF1E", size: "small" },
  { name: "HTML5", color: "#E34F26", size: "small" },
  { name: "CSS3", color: "#1572B6", size: "small" },
];

const toolsStack = [
  { name: "Git", color: "#F05032" },
  { name: "Figma", color: "#F24E1E" },
  { name: "VS Code", color: "#007ACC" },
  { name: "GitHub", color: "#FFFFFF" },
];

const backendStack = [
  { name: "Node.js", color: "#339933" },
  { name: "Firebase", color: "#FFCA28" },
];

export default function Competences() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const toolRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backendRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const tools = toolRefs.current.filter(Boolean) as HTMLDivElement[];
    const title = titleRef.current;

    if (!section || !title || cards.length === 0) return;

    const ctx = gsap.context(() => {
      // Animation
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

      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.8, y: 100, rotationX: 45 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationX: 0,
          duration: 1.2,
          ease: "back.out(1.5)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
          onComplete: () => {
            cards.forEach((card, i) => {
              gsap.to(card, {
                y: "+=15",
                rotationZ: i % 2 === 0 ? 2 : -2,
                duration: 2 + i * 0.2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 0.5,
              });
            });
          },
        },
      );

      // Tools animation
      if (tools.length > 0) {
        gsap.fromTo(
          tools,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: "top 50%",
            },
          },
        );
      }
    }, sectionRef);

    // Parallax effect on mouse move
    const setters = cards.map((card, i) => ({
      x: gsap.quickTo(card, "x", { duration: 0.8, ease: "power3.out" }),
      y: gsap.quickTo(card, "y", { duration: 0.8, ease: "power3.out" }),
      strength: ((i % 3) + 1) * 10,
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

        <div className="competences__grid">
          {techStack.map((tech, index) => (
            <div
              key={tech.name}
              className={`tech-card tech-card--${tech.size}`}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              style={{ "--tech-color": tech.color } as React.CSSProperties}
            >
              <div className="tech-card__glow" />
              <div className="tech-card__content">
                <span className="tech-card__name">{tech.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="competences__tools">
          <h3 className="competences__tools-title">
            {t("skills.tools_title")}
          </h3>
          <div className="competences__tools-grid">
            {toolsStack.map((tool, index) => (
              <div
                key={tool.name}
                className="tool-card"
                ref={(el) => {
                  toolRefs.current[index] = el;
                }}
                style={{ "--tool-color": tool.color } as React.CSSProperties}
              >
                <div className="tool-dot" />
                <span>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="competences__tools">
          <h3 className="competences__tools-title">
            {t("skills.backend_title")}
          </h3>
          <div className="competences__tools-grid">
            {backendStack.map((tool, index) => (
              <div
                key={tool.name}
                className="tool-card"
                ref={(el) => {
                  backendRefs.current[index] = el;
                }}
                style={{ "--tool-color": tool.color } as React.CSSProperties}
              >
                <div className="tool-dot" />
                <span>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
