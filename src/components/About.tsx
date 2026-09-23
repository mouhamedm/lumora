import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, ArrowRight } from "lucide-react";
import aboutImg from "../assets/images/about-img.webp";
import TextReveal from "./TextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const imageWrapper = imageWrapperRef.current;
    const imageInner = imageInnerRef.current;
    const btn = btnRef.current;
    if (!section) return;

    let visibilityObserver: IntersectionObserver | null = null;

    const ctx = gsap.context(() => {
      const content = section.querySelector(".about__content");
      const lines = linesRef.current.filter(Boolean);

      // Eyebrow badge entrance
      gsap.fromTo(
        ".about-eyebrow",
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: content || section,
            start: "top 88%",
            once: true,
            fastScrollEnd: true,
          },
        },
      );

      // Paragraphs smooth stagger
      if (lines.length > 0) {
        gsap.fromTo(
          lines,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            delay: 0.25,
            clearProps: "transform",
            scrollTrigger: {
              trigger: content || section,
              start: "top 88%",
              once: true,
              fastScrollEnd: true,
            },
          },
        );
      }

      // CTA button entrance
      if (btn) {
        gsap.fromTo(
          btn,
          { opacity: 0, y: 20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: "power3.out",
            delay: 0.45,
            clearProps: "transform",
            scrollTrigger: {
              trigger: content || section,
              start: "top 88%",
              once: true,
              fastScrollEnd: true,
            },
          },
        );
      }

      // Image entrance animation
      if (imageWrapper) {
        gsap.fromTo(
          imageWrapper,
          { opacity: 0, scale: 0.92, y: 35 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: imageWrapper,
              start: "top 85%",
              once: true,
              fastScrollEnd: true,
            },
          },
        );
      }

      // Floating badges infinite gentle hover
      const badges = badgeRefs.current.filter(Boolean);
      const badgeTweens = badges.map((badge, index) =>
        gsap.to(badge, {
          y: "+=10",
          rotation: index % 2 === 0 ? 4 : -4,
          duration: 2.4 + index * 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        }),
      );

      if (typeof IntersectionObserver !== "undefined") {
        visibilityObserver = new IntersectionObserver(
          ([entry]) => {
            section.classList.toggle("about--offscreen", !entry.isIntersecting);
            badgeTweens.forEach((tween) =>
              entry.isIntersecting ? tween.play() : tween.pause(),
            );
          },
          { rootMargin: "200px 0px" },
        );
        visibilityObserver.observe(section);
      }
    }, section);

    // Interactive 3D tilt on imageInner
    if (imageWrapper && imageInner) {
      const xTo = gsap.quickTo(imageInner, "rotationY", {
        duration: 0.4,
        ease: "power2.out",
      });
      const yTo = gsap.quickTo(imageInner, "rotationX", {
        duration: 0.4,
        ease: "power2.out",
      });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = imageWrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        xTo(x * 20);
        yTo(-y * 20);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      imageWrapper.addEventListener("mousemove", handleMouseMove);
      imageWrapper.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        imageWrapper.removeEventListener("mousemove", handleMouseMove);
        imageWrapper.removeEventListener("mouseleave", handleMouseLeave);
        visibilityObserver?.disconnect();
        ctx.revert();
      };
    }

    return () => {
      visibilityObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  // Magnetic button hover effect
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power2.out" });
    const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      xTo(relX * 0.3);
      yTo(relY * 0.3);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      className="relative py-16 md:py-32 px-4 sm:px-6 md:px-12 max-w-7xl w-full mx-auto min-h-[80vh] flex items-center justify-center z-2 overflow-hidden"
      id="about"
      ref={sectionRef}
    >
      <div className="w-full max-w-310 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center justify-center">
        {/* LEFT COLUMN */}
        <div className="relative perspective-distant flex justify-center lg:justify-end items-center w-full">
          <div
            className="relative w-full max-w-85 sm:max-w-100 lg:max-w-110 aspect-4/5 transform-3d"
            ref={imageWrapperRef}
          >
            {/* Glow orb */}
            <div
              className="about-glow-orb absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] opacity-30 z-[-1] rounded-full pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--accent) 0%, transparent 25%, var(--accent-hover) 50%, transparent 75%, var(--accent) 100%)",
                filter: "blur(45px)",
              }}
            />

            {/* Image */}
            <div
              className="relative w-full h-full rounded-3xl overflow-hidden bg-[rgba(23,23,26,0.7)] backdrop-blur-md border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] transition-transform duration-150 ease-out"
              ref={imageInnerRef}
            >
              <img
                src={aboutImg}
                alt="À propos de moi"
                className="w-full h-full object-cover opacity-90 filter-[grayscale(15%)_contrast(1.08)] transition-[filter,transform] duration-500 hover:scale-[1.03] hover:filter-[grayscale(0%)_contrast(1.1)]"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Badge 1 */}
            <div
              className="absolute top-[8%] -right-2.5 sm:-right-4 md:-right-7 bg-[rgba(23,23,26,0.85)] backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.5)] z-20 select-none"
              ref={(el) => {
                badgeRefs.current[0] = el;
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6 text-(--accent)"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>

            {/* Badge 2 */}
            <div
              className="absolute bottom-[16%] -left-2.5 sm:-left-4 md:-left-7 bg-[rgba(23,23,26,0.85)] backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.5)] z-20 select-none"
              ref={(el) => {
                badgeRefs.current[1] = el;
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="about__content flex flex-col items-center text-center mx-auto lg:items-start lg:text-left lg:mx-0 max-w-135 lg:max-w-140 w-full">
          {/* Eyebrow Badge */}
          <div className="about-eyebrow inline-flex items-center font-(--font-mono) text-xs tracking-widest uppercase text-(--accent) mb-4 px-4 py-1.5 bg-(--accent-soft) border border-[rgba(76,141,255,0.2)] rounded-full shadow-[0_0_20px_rgba(76,141,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-(--accent)" />
            {t("about.eyebrow")}
          </div>

          {/* Section Title */}
          <h2
            className="about__title font-display text-[clamp(38px,4.5vw,64px)] lg:text-[64px] leading-[1.15] font-bold mb-6 text-white text-center lg:text-left"
            ref={titleRef}
          >
            <TextReveal
              text={t("about.title_start")}
              type="chars"
              spanClassName="title-glow"
              triggerRef={sectionRef}
            />{" "}
            <TextReveal
              text={t("about.title_highlight")}
              type="chars"
              spanClassName="highlight"
              delay={0.2}
              triggerRef={sectionRef}
            />
            {t("about.title_end") ? (
              <>
                {" "}
                <TextReveal
                  text={t("about.title_end")}
                  type="chars"
                  delay={0.35}
                  triggerRef={sectionRef}
                />
              </>
            ) : null}
          </h2>

          {/* Descriptive Text Lines */}
          <div className="text-sm md:text-base text-(--text-secondary) leading-relaxed mb-8 flex flex-col gap-4">
            <p
              className=""
              ref={(el) => {
                linesRef.current[0] = el;
              }}
            >
              {t("about.p1")}
            </p>
            <p
              className=""
              ref={(el) => {
                linesRef.current[1] = el;
              }}
            >
              {t("about.p2")}
            </p>
            <p
              className=""
              ref={(el) => {
                linesRef.current[2] = el;
              }}
            >
              {t("about.p3")}
            </p>
          </div>

          {/* CTA Link */}
          <div>
            <a
              href="https://wa.me/2250719076206"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic inline-flex items-center gap-3 px-8 py-3.5 bg-white/5 hover:bg-(--accent-soft) border border-white/15 hover:border-[rgba(76,141,255,0.3)] rounded-full text-white text-sm font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(76,141,255,0.18)] group"
              ref={btnRef}
            >
              <span>{t("about.cta")}</span>
              <ArrowRight className="w-4 h-4 text-(--accent) transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
