import * as React from "react";
import { useEffect, useState, useCallback, useRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useScroll, useMotionValueEvent } from "motion/react";
import { Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "../lib/utils";
import idconsultImg from "../assets/images/idconsult.webp";
import strideImg from "../assets/images/stride.webp";
import ghostImg from "../assets/images/ghost.webp";
import pulseImg from "../assets/images/pulse.webp";
import inadiaImg from "../assets/images/inadia.webp";
import TextReveal from "./TextReveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// INLINE STYLES
const PROJECTS_STYLES = `
.project-glass-pill {
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-glass-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(76, 141, 255, 0.4);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(76, 141, 255, 0.2);
  color: #FFFFFF;
}
`;

// TYPES & INTERFACES
export type ProjectItem = {
  quote: string;
  name: string;
  designation?: string;
  tags: string[];
  src: string;
  link?: string;
};

// MAGNETIC BUTTON
export type MagneticButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      as?: React.ElementType;
    };

export const MagneticButton = forwardRef<HTMLElement, MagneticButtonProps>(
  (
    { className, children, as: Component = "button", ...props },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.3,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          if (node) {
            (localRef as React.MutableRefObject<HTMLElement | null>).current =
              node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef)
              (
                forwardedRef as React.MutableRefObject<HTMLElement | null>
              ).current = node;
          }
        }}
        className={cn("cursor-pointer select-none", className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

// IMAGE CONTAINER
type ImageContainerProps = {
  src: string;
  alt: string;
  outerRounding: string;
  innerRounding: string;
  outlineColor?: string;
};

const ImageContainer = ({
  src,
  alt,
  outerRounding,
  innerRounding,
  outlineColor = "rgba(255, 255, 255, 0.02)",
}: ImageContainerProps) => (
  <div
    className="relative h-full w-full border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.22)] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(255,255,255,0.03)] group/img"
    style={{
      borderRadius: outerRounding,
      padding: "1.5px",
      backgroundColor: outlineColor,
    }}
  >
    <div
      className="relative h-full w-full overflow-hidden bg-[#111014]"
      style={{
        borderRadius: innerRounding,
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-[1.03]"
        loading="lazy"
        decoding="async"
      />
    </div>
  </div>
);

// PROJECT SHOWCASE
export type ProjectShowcaseProps = {
  testimonials: ProjectItem[];
  active?: number;
  onNext?: () => void;
  onPrev?: () => void;
  colors?: { name?: string; position?: string; testimony?: string };
  fontSizes?: { name?: string; position?: string; testimony?: string };
  desktopVersionBottomThreshold?: number;
  imageAspectRatio?: number;
  onItemClick?: (link: string) => void;
  outerRounding?: string;
  innerRounding?: string;
  outlineColor?: string;
  buttonInscriptions?: {
    previousButton: string;
    nextButton: string;
    openWebAppButton: string;
  };
};

export const ProjectShowcase = ({
  testimonials,
  active: controlledActive,
  onNext,
  onPrev,
  colors = { name: "#fff", position: "var(--accent)", testimony: "#9C9B96" },
  fontSizes = {
    name: "clamp(22px, 3.2vw, 38px)",
    position: "13px",
    testimony: "clamp(13px, 1.1vw, 16px)",
  },
  desktopVersionBottomThreshold = 1024,
  imageAspectRatio = 1.45,
  onItemClick,
  outerRounding = "20px",
  innerRounding = "18px",
  outlineColor = "rgba(255, 255, 255, 0.02)",
  buttonInscriptions = {
    previousButton: "Previous",
    nextButton: "Next",
    openWebAppButton: "Open Web App",
  },
}: ProjectShowcaseProps) => {
  const [internalActive, setInternalActive] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [componentWidth, setComponentWidth] = useState(0);
  const componentRef = useRef<HTMLDivElement>(null);

  const active =
    controlledActive !== undefined ? controlledActive : internalActive;

  const handleNext = useCallback(() => {
    if (onNext) {
      onNext();
    } else {
      setInternalActive((prev) => (prev + 1) % testimonials.length);
    }
  }, [onNext, testimonials.length]);

  const handlePrev = useCallback(() => {
    if (onPrev) {
      onPrev();
    } else {
      setInternalActive(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length,
      );
    }
  }, [onPrev, testimonials.length]);

  const isActive = (index: number) => index === active;

  const handleResize = useCallback(() => {
    if (componentRef.current) {
      setComponentWidth(componentRef.current.offsetWidth);
      setIsMobileView(
        componentRef.current.offsetWidth < desktopVersionBottomThreshold,
      );
    }
  }, [desktopVersionBottomThreshold]);

  useEffect(() => {
    const el = componentRef.current;
    const resizeObserver = new ResizeObserver(handleResize);
    if (el) {
      resizeObserver.observe(el);
    }
    handleResize();
    return () => {
      if (el) {
        resizeObserver.unobserve(el);
      }
    };
  }, [handleResize]);

  const randomRotateY = (idx: number) => {
    const rotations = [-5, 4, -3, 6, -4, 5];
    return rotations[idx % rotations.length];
  };

  const calculateGap = (width: number) => {
    if (width <= 768) return 24;
    if (width <= 1024) return 32;
    if (width <= 1280) return 72;
    if (width <= 1536) return 88;
    return 100;
  };

  const currentProject = testimonials[active] || testimonials[0];

  return (
    <div ref={componentRef} className="w-full mx-auto antialiased">
      <div
        className="relative items-center"
        style={{
          display: "grid",
          gridTemplateColumns: isMobileView ? "1fr" : "1.05fr 1fr",
          gap: `${calculateGap(componentWidth)}px`,
        }}
      >
        {/* Visual 3D Stacked Deck */}
        <div className="w-full">
          <div
            className="relative w-full"
            style={{
              paddingTop: `${(1 / (isMobileView ? 1.6 : imageAspectRatio)) * 100}%`,
            }}
          >
            <AnimatePresence mode="popLayout">
              {testimonials.map((item, index) => (
                <motion.div
                  key={item.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(index),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.65,
                    scale: isActive(index) ? 1 : 0.94,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(index),
                    zIndex: isActive(index) ? 99 : testimonials.length - index,
                    y: isActive(index) ? [0, -35, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(index),
                  }}
                  transition={{ duration: 0.45, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <ImageContainer
                    src={item.src}
                    alt={item.name}
                    outerRounding={outerRounding}
                    innerRounding={innerRounding}
                    outlineColor={outlineColor}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Details & Interactive Controls */}
        <div className="flex justify-between flex-col py-4 w-full">
          <motion.div
            key={active}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {/* Project Name */}
            <h3
              className="font-bold font-display leading-tight text-white mb-2.5 sm:mb-5"
              style={{
                fontSize: fontSizes.name,
                color: colors.name,
              }}
            >
              {currentProject.name}
            </h3>

            {/* Tech Stack Pills below project name */}
            {currentProject.tags && currentProject.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-3.5 sm:mb-7">
                {currentProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs text-[#D8D7D2] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] px-3.5 py-1.5 rounded-full backdrop-blur-md transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-white select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Project Description */}
            <p className="font-body text-sm sm:text-base leading-relaxed text-(--text-secondary) mb-3 sm:mb-8 md:mb-10 max-w-xl line-clamp-2 sm:line-clamp-none">
              {currentProject.quote}
            </p>
          </motion.div>

          {/* Navigation & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full pt-2 sm:pt-4">
            <MagneticButton
              type="button"
              onClick={handlePrev}
              className="project-glass-pill px-4 sm:px-5 py-2.5 rounded-full text-(--text-secondary) font-medium text-xs md:text-sm hover:text-white flex items-center justify-center gap-2 transition-all group shrink-0 md:min-w-31.25"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>{buttonInscriptions.previousButton}</span>
            </MagneticButton>

            <MagneticButton
              type="button"
              onClick={handleNext}
              className="project-glass-pill px-4 sm:px-5 py-2.5 rounded-full text-(--text-secondary) font-medium text-xs md:text-sm hover:text-white flex items-center justify-center gap-2 transition-all group shrink-0 md:min-w-31.25"
            >
              <span>{buttonInscriptions.nextButton}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </MagneticButton>

            <MagneticButton
              as="a"
              href={currentProject.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                onItemClick && onItemClick(currentProject.link || "")
              }
              className="bg-white text-[#0B0B0C] font-semibold text-xs md:text-sm px-5 md:px-6 py-2.5 rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] hover:bg-[#FAF9F5] transition-all flex items-center justify-center gap-2 group shrink-0 min-w-fit md:min-w-32.5"
            >
              <span>{buttonInscriptions.openWebAppButton}</span>
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// MAIN PINNED SCROLL-DRIVEN PROJECTS SECTION
export default function Projects() {
  const { t, i18n } = useTranslation();
  const isFr = i18n.language === "fr";

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const projectsData: ProjectItem[] = [
    {
      name: t("projects.p1_title"),
      quote: t("projects.p1_desc"),
      tags: ["HTML5", "CSS3", "JavaScript", "GSAP", "Lottie"],
      src: idconsultImg,
      link: "https://www.idconsult-ml.com/",
    },
    {
      name: t("projects.inadia_title"),
      quote: t("projects.inadia_desc"),
      tags: ["HTML5", "CSS3", "JavaScript", "Firebase"],
      src: inadiaImg,
      link: "https://inadia.shop/",
    },
    {
      name: t("projects.p2_title"),
      quote: t("projects.p2_desc"),
      tags: [
        "Next.js 15",
        "React 18",
        "TypeScript",
        "Tailwind CSS",
        "Three.js",
        "GSAP",
      ],
      src: strideImg,
      link: "https://stride-sneaker.vercel.app/",
    },
    {
      name: t("projects.p3_title"),
      quote: t("projects.p3_desc"),
      tags: ["Next.js", "TypeScript", "Tailwind", "GSAP"],
      src: ghostImg,
      link: "https://ghost-div.netlify.app/",
    },
    {
      name: t("projects.p5_title"),
      quote: t("projects.p5_desc"),
      tags: ["Next.js 15", "React 18", "TypeScript", "Tailwind CSS", "GSAP"],
      src: pulseImg,
      link: "https://pulse-smartwatch.vercel.app/",
    },
  ];

  const totalProjects = projectsData.length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    const sources = [idconsultImg, inadiaImg, strideImg, ghostImg, pulseImg];

    const warm = () => {
      sources.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.decode?.().catch(() => {});
      });
    };

    const ric = (window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;

    if (ric) {
      const id = ric(warm, { timeout: 3000 });
      return () => (window as typeof window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
    }

    const id = window.setTimeout(warm, 1500);
    return () => window.clearTimeout(id);
  }, []);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const adjusted = Math.min(latest * 1.02, 0.999);
    const index = Math.min(
      Math.floor(adjusted * totalProjects),
      totalProjects - 1,
    );
    setActive(index);
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") return;

    let observer: IntersectionObserver | null = null;

    const ctx = gsap.context(() => {
      // Eyebrow entrance
      const eyebrowTween = gsap.fromTo(
        ".projects-eyebrow",
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          paused: true,
        },
      );

      // Deck container entrance
      const deckTween = gsap.fromTo(
        ".projects-deck-wrapper",
        { opacity: 0, y: 45, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          delay: 0.25,
          ease: "power3.out",
          clearProps: "transform",
          paused: true,
        },
      );

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            eyebrowTween.play();
            deckTween.play();
            observer?.disconnect();
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0 },
      );
      observer.observe(section);
    }, section);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = Math.min(active + 1, totalProjects - 1);
    setActive(nextIdx);
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      const scrollHeight = sectionRef.current.offsetHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const targetY =
          scrollTop + (nextIdx / (totalProjects - 1)) * scrollHeight;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  }, [active, totalProjects]);

  const handlePrev = useCallback(() => {
    const prevIdx = Math.max(active - 1, 0);
    setActive(prevIdx);
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top;
      const scrollHeight = sectionRef.current.offsetHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const targetY =
          scrollTop + (prevIdx / (totalProjects - 1)) * scrollHeight;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  }, [active, totalProjects]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full z-10 bg-(--color-bg-base)"
      id="projects"
    >
      <style>{PROJECTS_STYLES}</style>
      <div className="relative w-full h-[320svh] sm:h-[340svh] lg:h-[360svh]">
        <div
          ref={containerRef}
          className="sticky top-0 w-full h-svh max-h-svh flex flex-col justify-center py-4 sm:py-6 md:py-10 px-4 sm:px-6 md:px-12 max-w-345 mx-auto box-border overflow-hidden translate-z-0"
        >
          {/* Header */}
          <div className="mb-2 sm:mb-6 md:mb-8 max-w-2xl">
            <div className="projects-eyebrow inline-flex items-center text-xs font-medium tracking-widest uppercase text-(--accent) mb-3 px-4 py-1.5 bg-(--accent-soft) border border-[rgba(76,141,255,0.2)] rounded-full shadow-[0_0_20px_rgba(76,141,255,0.15)]">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-(--accent)" />
              {t("projects.eyebrow")}
            </div>
            <h2 className="font-(--font-display) text-[clamp(38px,4.5vw,64px)] lg:text-[64px] leading-[1.1] m-0">
              <TextReveal
                text={t("projects.title_start")}
                type="chars"
                spanClassName="title-glow"
                triggerRef={sectionRef}
              />{" "}
              <TextReveal
                text={t("projects.title_highlight")}
                type="chars"
                spanClassName="highlight"
                delay={0.2}
                triggerRef={sectionRef}
              />
            </h2>
            <p className="font-(--font-body) text-sm sm:text-base text-(--text-secondary) mt-2.5 sm:mt-3 leading-relaxed max-w-xl">
              {t("projects.subtitle")}
            </p>
          </div>

          <div className="projects-deck-wrapper w-full translate-z-0">
            <ProjectShowcase
              testimonials={projectsData}
              active={active}
              onNext={handleNext}
              onPrev={handlePrev}
              buttonInscriptions={{
                previousButton: isFr ? "Précédent" : "Previous",
                nextButton: isFr ? "Suivant" : "Next",
                openWebAppButton: isFr ? "Voir" : "View",
              }}
              outlineColor="rgba(255, 255, 255, 0.02)"
              colors={{
                name: "#FFFFFF",
                position: "var(--accent)",
                testimony: "var(--text-secondary)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
