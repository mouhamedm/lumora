import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { Sparkles } from "lucide-react";

export interface HeroProps {
  isLoaded?: boolean;
}

export default function Hero({ isLoaded = false }: HeroProps) {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);
  const giantParallaxRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const scene = sceneRef.current;
    if (!scene || cards.length === 0) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (auroraRef.current && gridRef.current) {
        gsap.set([auroraRef.current, gridRef.current], { opacity: 0 });
      }
      gsap.set(".hero__eyebrow", { x: -40, opacity: 0 });
      gsap.set(".hero__name-mask", { scaleX: 1 });
      gsap.set(".hero__subtitle", { y: 24, opacity: 0 });
      gsap.set(".hero__social-link", { opacity: 0, x: -20, scale: 0.7 });
      gsap.set(".hero__ctas > *", { opacity: 0, y: 30, scale: 0.95 });
      gsap.set(cards, { opacity: 0, x: 150 });

      if (!isLoaded) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      if (auroraRef.current && gridRef.current) {
        tl.to(
          [auroraRef.current, gridRef.current],
          { opacity: 1, duration: 1.5 },
          0,
        );
      }

      // Eyebrow slide in
      tl.to(
        ".hero__eyebrow",
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.1,
      );

      // Name mask reveal
      tl.to(
        ".hero__name-mask",
        {
          scaleX: 0,
          duration: 1.1,
          ease: "power3.inOut",
        },
        0.2,
      );

      // Cards
      if (isMobile) {
        gsap.to(cards, {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: scene,
            start: "top 75%",
          },
        });
      } else {
        tl.to(
          cards,
          {
            opacity: 1,
            x: 0,
            duration: 1.3,
            ease: "power4.out",
            stagger: 0.12,
          },
          0.15,
        );
      }

      // Subtitle
      tl.to(
        ".hero__subtitle",
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        0.6,
      );

      // Socials
      tl.to(
        ".hero__social-link",
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(2)",
          clearProps: "transform",
        },
        0.75,
      );

      // CTAs
      tl.to(
        ".hero__ctas > *",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          clearProps: "transform",
        },
        0.9,
      );
    }, introRef);

    if (!isLoaded) return () => ctx.revert();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || isMobile) {
      return () => ctx.revert();
    }

    const floaters = cards.map((card, i) =>
      gsap.to(card, {
        y: "+=14",
        duration: 2.4 + i * 0.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }),
    );

    const setters = cards.map((_, i) => ({
      x: gsap.quickTo(cards[i], "x", { duration: 0.6, ease: "power3.out" }),
      rotY: gsap.quickTo(cards[i], "rotationY", {
        duration: 0.6,
        ease: "power3.out",
      }),
      strength: (i + 1) * 6,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = scene.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;

      setters.forEach((setter) => {
        setter.x(relX * setter.strength * 4);
        setter.rotY(relX * setter.strength);
      });
    };

    const handleMouseLeave = () => {
      setters.forEach((setter) => {
        setter.x(0);
        setter.rotY(0);
      });
    };

    scene.addEventListener("mousemove", handleMouseMove);
    scene.addEventListener("mouseleave", handleMouseLeave);

    // Mouse tracking parallax for background watermark (Option 1)
    const hero = heroRef.current;
    const giantParallax = giantParallaxRef.current;
    let handleHeroMouseMove: ((e: MouseEvent) => void) | null = null;
    let handleHeroMouseLeave: (() => void) | null = null;

    if (hero && giantParallax) {
      const qx = gsap.quickTo(giantParallax, "x", { duration: 1.2, ease: "power2.out" });
      const qy = gsap.quickTo(giantParallax, "y", { duration: 1.2, ease: "power2.out" });

      handleHeroMouseMove = (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        qx(relX * -40);
        qy(relY * -20);
      };

      handleHeroMouseLeave = () => {
        qx(0);
        qy(0);
      };

      hero.addEventListener("mousemove", handleHeroMouseMove);
      hero.addEventListener("mouseleave", handleHeroMouseLeave);
    }

    return () => {
      scene.removeEventListener("mousemove", handleMouseMove);
      scene.removeEventListener("mouseleave", handleMouseLeave);
      if (hero && handleHeroMouseMove && handleHeroMouseLeave) {
        hero.removeEventListener("mousemove", handleHeroMouseMove);
        hero.removeEventListener("mouseleave", handleHeroMouseLeave);
      }
      floaters.forEach((tween) => tween.kill());
      ctx.revert();
    };
  }, [isLoaded]);

  return (
    <section
      ref={heroRef}
      className="hero relative min-h-screen grid grid-cols-2 items-center gap-[60px] max-w-[1280px] w-full mx-auto px-12 py-[80px] pt-[140px] overflow-hidden max-[960px]:grid-cols-2 max-[960px]:px-8 max-[960px]:py-[60px] max-[960px]:pt-[120px] max-[960px]:gap-6 max-[960px]:min-h-[60vh] max-[768px]:flex max-[768px]:flex-col max-[768px]:justify-center max-[768px]:px-6 max-[768px]:pt-[120px] max-[768px]:pb-[60px] max-[768px]:min-h-screen max-[768px]:gap-[70px]"
      id="top"
    >
      {/* Aurora orbs */}
      <div className="hero__aurora" ref={auroraRef} aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
      </div>

      {/* Grid overlay */}
      <div className="hero__grid" ref={gridRef} aria-hidden="true" />

      {/* Subtle Background Kinetic Watermark (Option 1) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
        aria-hidden="true"
      >
        <div ref={giantParallaxRef} className="will-change-transform w-full">
          <div className="hero-watermark-track">
            {/* Track A */}
            <div className="flex items-center space-x-12 shrink-0 pr-12 hero-watermark-text">
              <span>MMD DEV</span>
              <span className="text-[var(--accent)] text-2xl md:text-3xl opacity-25 select-none">✦</span>
              <span>MMD DEV</span>
              <span className="text-[var(--accent)] text-2xl md:text-3xl opacity-25 select-none">✦</span>
              <span>MMD DEV</span>
              <span className="text-[var(--accent)] text-2xl md:text-3xl opacity-25 select-none">✦</span>
              <span>MMD DEV</span>
              <span className="text-[var(--accent)] text-2xl md:text-3xl opacity-25 select-none">✦</span>
            </div>
            {/* Track B for seamless loop */}
            <div className="flex items-center space-x-12 shrink-0 pr-12 hero-watermark-text">
              <span>MMD DEV</span>
              <span className="text-[var(--accent)] text-2xl md:text-3xl opacity-25 select-none">✦</span>
              <span>MMD DEV</span>
              <span className="text-[var(--accent)] text-2xl md:text-3xl opacity-25 select-none">✦</span>
              <span>MMD DEV</span>
              <span className="text-[var(--accent)] text-2xl md:text-3xl opacity-25 select-none">✦</span>
              <span>MMD DEV</span>
              <span className="text-[var(--accent)] text-2xl md:text-3xl opacity-25 select-none">✦</span>
            </div>
          </div>
        </div>
      </div>

      {/* LEFT */}
      <div
        className="hero__content relative z-[2] max-[768px]:w-full"
        ref={introRef}
      >
        {/* Eyebrow */}
        <p className="hero__eyebrow inline-flex items-center font-[var(--font-mono)] text-xs font-medium tracking-[0.1em] uppercase text-[var(--accent)] mb-7 px-4 py-1.5 bg-[var(--accent-soft)] border border-[rgba(76,141,255,0.2)] rounded-full shadow-[0_0_20px_rgba(76,141,255,0.15)]">
          <Sparkles className="w-3.5 h-3.5 mr-2 text-[var(--accent)]" />
          {t("hero.eyebrow")}
        </p>

        <h1 className="hero__name relative font-[var(--font-display)] text-[clamp(60px,5.5vw,96px)] leading-[1.05] font-extrabold mb-6 tracking-[-0.03em] text-[var(--text-primary)] w-fit">
          <span className="text-[var(--text-primary)]">{t("hero.name1")}</span>
          <br />
          <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(242,241,237,0.5)] max-[768px]:[-webkit-text-stroke-width:1px]">
            {t("hero.name2")}
          </span>
          <br />
          <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(242,241,237,0.5)] max-[768px]:[-webkit-text-stroke-width:1px]">
            {t("hero.name3")}
          </span>
          <span
            className="hero__name-mask absolute inset-0 bg-[var(--bg-base)] origin-right pointer-events-none"
            aria-hidden="true"
          />
        </h1>

        <p className="hero__subtitle inline-flex items-center gap-2.5 font-[var(--font-display)] text-[20px] md:text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.02em] mb-9 leading-[1.3]">
          <span className="inline-flex items-center justify-center shrink-0" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent)] drop-shadow-[0_0_10px_#4c8dff] animate-spin-slow"
            >
              <path
                d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span>{t("hero.subtitle")}</span>
        </p>

        {/* Socials */}
        <div className="hero__socials flex gap-2.5 mb-9">
          <a
            href="https://github.com/mouhamedm"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hero__social-link flex items-center justify-center w-10 h-10 rounded-[10px] border border-[var(--border-subtle)] text-[var(--text-secondary)] no-underline bg-[rgba(255,255,255,0.02)] transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-[15px] hover:scale-[1.15] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),0_0_25px_rgba(76,141,255,0.3)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.44-2.7 5.42-5.27 5.7.42.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/mouhamedm/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hero__social-link flex items-center justify-center w-10 h-10 rounded-[10px] border border-[var(--border-subtle)] text-[var(--text-secondary)] no-underline bg-[rgba(255,255,255,0.02)] transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-[15px] hover:scale-[1.15] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),0_0_25px_rgba(76,141,255,0.3)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
            </svg>
          </a>
          <a
            href="mailto:mmddev310@gmail.com"
            aria-label="Email"
            className="hero__social-link flex items-center justify-center w-10 h-10 rounded-[10px] border border-[var(--border-subtle)] text-[var(--text-secondary)] no-underline bg-[rgba(255,255,255,0.02)] transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-[15px] hover:scale-[1.15] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4),0_0_25px_rgba(76,141,255,0.3)]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M3 6h18v12H3z" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
        </div>

        {/* CTAs */}
        <div className="hero__ctas flex gap-[14px] flex-wrap">
          <a
            href="/cv-mouhamed-dicko.pdf"
            className="hero__cv group btn-slide-up relative inline-flex items-center justify-center gap-2 text-sm font-semibold font-[var(--font-body)] text-white no-underline py-[13px] px-[27px] rounded-[10px] border border-[rgba(76,141,255,0.3)] bg-gradient-to-br from-[rgba(76,141,255,0.25)] to-[rgba(76,141,255,0.1)] shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-[10px] transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-[3px] hover:border-[var(--accent)] hover:shadow-[0_12px_32px_rgba(76,141,255,0.4)]"
            download="CV_Mouhamed_Dicko.pdf"
          >
            {t("hero.download_cv")}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className="transition-transform duration-300 group-hover:translate-y-[3px]"
            >
              <path d="M12 3v13m0 0-4-4m4 4 4-4M4 21h16" />
            </svg>
          </a>
          <a
            href="#projects"
            className="hero__scroll group btn-slide-up-ghost relative inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] no-underline py-[14px] px-6 rounded-[10px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)] transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-[3px] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:shadow-[0_12px_32px_rgba(255,255,255,0.05)]"
          >
            {t("hero.view_projects")}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition-transform duration-300 group-hover:translate-x-[3px]"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero__right -translate-y-10 max-[768px]:relative max-[768px]:w-full max-[768px]:h-[340px] max-[768px]:flex max-[768px]:justify-center max-[768px]:items-center max-[768px]:translate-y-0">
        <div
          className="hero__scene relative h-[480px] [perspective:1400px] z-[1] max-[960px]:h-[320px] max-[768px]:w-full max-[768px]:h-full max-[768px]:scale-[0.85] max-[768px]:[transform-origin:center_center] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[340px] before:h-[340px] before:rounded-full before:bg-[radial-gradient(circle,rgba(76,141,255,0.15)_0%,transparent_70%)] before:[filter:blur(40px)] before:pointer-events-none before:[animation:float-orb_8s_ease-in-out_infinite] max-[768px]:before:[filter:none]"
          ref={sceneRef}
        >
          {/* Main IDE */}
          <div
            className="code-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] z-[1] max-[960px]:w-[220px] max-[768px]:w-[260px] rounded-[14px] bg-[rgba(23,23,26,0.85)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.08)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(76,141,255,0.05),inset_0_1px_0_rgba(255,255,255,0.06)] [transform-style:preserve-3d] will-change-transform transition-shadow duration-[400ms] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(76,141,255,0.2),0_0_40px_rgba(76,141,255,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] max-[768px]:backdrop-blur-none max-[768px]:bg-[#1c1c20] max-[768px]:shadow-[0_12px_28px_rgba(0,0,0,0.5)]"
            ref={(el) => {
              cardRefs.current[0] = el;
            }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] rounded-t-[14px]">
              <span className="w-[9px] h-[9px] rounded-full bg-[#e5534b] shadow-[0_0_6px_rgba(229,83,75,0.5)]" />
              <span className="w-[9px] h-[9px] rounded-full bg-[#d4a72c] shadow-[0_0_6px_rgba(212,167,44,0.5)]" />
              <span className="w-[9px] h-[9px] rounded-full bg-[#57ab5a] shadow-[0_0_6px_rgba(87,171,90,0.5)]" />
            </div>
            <pre className="m-0 px-5 py-[18px] font-[var(--font-mono)] text-[12.5px] leading-[1.75] text-[var(--text-secondary)] whitespace-pre-wrap">
              <span className="text-[#c792ea]">const</span>{" "}
              <span className="text-[var(--accent)] font-semibold">
                Developer
              </span>{" "}
              = () =&gt; {"{"}
              {"\n  "}
              <span className="text-[#c792ea]">const</span> [passion,
              setPassion] ={" "}
              <span className="text-[var(--accent)] font-semibold">
                useState
              </span>
              (<span className="text-[#c792ea]">true</span>);
              {"\n  "}
              <span className="text-[#c792ea]">return</span> ({"\n    "}&lt;
              <span className="text-[var(--accent)] font-semibold">
                div
              </span>{" "}
              <span className="text-[#c3e88d]">className</span>=
              <span className="text-[#c3e88d]">"code"</span>&gt;
              {"\n      {"} passion &amp;&amp; &lt;
              <span className="text-[var(--accent)] font-semibold">
                BuildIdeas
              </span>{" "}
              /&gt; {"}"}
              {"\n      "}&lt;
              <span className="text-[var(--accent)] font-semibold">
                CreateImpact
              </span>{" "}
              /&gt;
              {"\n    "}&lt;/
              <span className="text-[var(--accent)] font-semibold">div</span>
              &gt;
              {"\n  "});
              {"\n"};
            </pre>
          </div>

          {/* Card: Expérience */}
          <div
            className="hero__float-card absolute top-[10px] right-[10px] z-[3] bg-[rgba(23,23,26,0.75)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-5 py-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] [transform-style:preserve-3d] will-change-transform max-[768px]:backdrop-blur-none max-[768px]:bg-[#1c1c20] max-[768px]:shadow-[0_12px_28px_rgba(0,0,0,0.5)] max-[960px]:scale-[0.85]"
            ref={(el) => {
              cardRefs.current[1] = el;
            }}
          >
            <span className="font-[var(--font-body)] text-[11px] text-[var(--text-muted)]">
              {t("hero.exp_title")}
            </span>
            <div className="font-[var(--font-display)] text-[28px] font-bold text-[var(--text-primary)] leading-[1.1] mt-1">
              3+
            </div>
            <span className="font-[var(--font-body)] text-xs text-[var(--text-secondary)]">
              {t("hero.exp_sub")}
            </span>
            <div className="mt-3 opacity-90 w-full flex justify-end">
              <svg
                viewBox="0 0 50 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M0 15 Q 10 10 15 15 T 30 10 T 40 5 L 50 0"
                  stroke="var(--accent)"
                />
              </svg>
            </div>
          </div>

          {/* Card: Projets */}
          <div
            className="hero__float-card absolute bottom-[60px] left-[-20px] z-[3] bg-[rgba(23,23,26,0.75)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-5 py-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] [transform-style:preserve-3d] will-change-transform max-[768px]:backdrop-blur-none max-[768px]:bg-[#1c1c20] max-[768px]:shadow-[0_12px_28px_rgba(0,0,0,0.5)] max-[960px]:scale-[0.85]"
            ref={(el) => {
              cardRefs.current[2] = el;
            }}
          >
            <span className="font-[var(--font-body)] text-[11px] text-[var(--text-muted)]">
              {t("hero.proj_title")}
            </span>
            <div className="font-[var(--font-display)] text-[28px] font-bold text-[var(--text-primary)] leading-[1.1] mt-1">
              10+
            </div>
            <span className="font-[var(--font-body)] text-xs text-[var(--text-secondary)]">
              {t("hero.proj_sub")}
            </span>
            <div className="mt-3 opacity-90 w-full flex justify-end">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

          {/* Card: Focus */}
          <div
            className="hero__float-card absolute z-[3] bg-[rgba(23,23,26,0.75)] backdrop-blur-[16px] border border-[rgba(255,255,255,0.06)] rounded-[14px] px-5 py-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] [transform-style:preserve-3d] will-change-transform max-[768px]:backdrop-blur-none max-[768px]:bg-[#1c1c20] max-[768px]:shadow-[0_12px_28px_rgba(0,0,0,0.5)] max-[960px]:scale-[0.85]"
            style={{ top: "62%", right: -30, marginTop: -10 }}
            ref={(el) => {
              cardRefs.current[3] = el;
            }}
          >
            <span className="font-[var(--font-body)] text-[11px] text-[var(--text-muted)]">
              {t("hero.focus_title")}
            </span>
            <ul className="list-none p-0 mt-3 font-[var(--font-body)] text-xs text-[var(--text-secondary)] flex flex-col gap-2">
              <li className="before:content-['•'] before:text-[var(--text-muted)] before:mr-2">
                UI / UX
              </li>
              <li className="before:content-['•'] before:text-[var(--text-muted)] before:mr-2">
                Performance
              </li>
              <li className="before:content-['•'] before:text-[var(--text-muted)] before:mr-2">
                Accessibilité
              </li>
            </ul>
          </div>

          {/* Floating symbol */}
          <div
            className="hero__symbol absolute font-[var(--font-mono)] text-[18px] font-bold text-[var(--accent)] [text-shadow:0_0_16px_rgba(76,141,255,0.6)] z-[4]"
            style={{ bottom: "40%", right: "10%" }}
          >
            &lt;/&gt;
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#what-i-do"
        className="hero__scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--text-secondary)] no-underline font-[var(--font-mono)] text-[11px] tracking-[0.1em] uppercase z-10 transition-colors duration-300 hover:text-[var(--text-primary)] max-[960px]:hidden"
        aria-label="Scroll down"
      >
        <span>{t("hero.scroll")}</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ animation: "bounce 2s infinite" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m0 0l-6-6m6 6l6-6"
          />
        </svg>
      </a>
    </section>
  );
}
