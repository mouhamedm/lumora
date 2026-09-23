import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const defaultTestimonials = [
  {
    id: 1,
    nameKey: "testimonials.t1_name",
    roleKey: "testimonials.t1_role",
    contentKey: "testimonials.t1_text",
    avatar: "",
  },
  {
    id: 2,
    nameKey: "testimonials.t2_name",
    roleKey: "testimonials.t2_role",
    contentKey: "testimonials.t2_text",
    avatar: "",
  },
  {
    id: 3,
    nameKey: "testimonials.t3_name",
    roleKey: "testimonials.t3_role",
    contentKey: "testimonials.t3_text",
    avatar: "",
  },
];

export default function Testimonials() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!section || !title || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        title.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: title,
            start: "top 88%",
            once: true,
            fastScrollEnd: true,
          },
        },
      );

      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: isMobile ? 40 : 70,
            rotationY: isMobile ? 0 : 20,
            rotationX: isMobile ? 0 : 15,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
              fastScrollEnd: true,
            },
            delay: isMobile ? 0 : i * 0.15,
            onComplete: () => {
              gsap.set(card, { clearProps: "transform" });
              card.style.transition =
                "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease";
            },
          },
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="relative py-16 md:py-30 px-4 sm:px-6 md:px-12 max-w-7xl w-full mx-auto min-h-[80vh] z-2 overflow-x-clip"
      id="testimonials"
      ref={sectionRef}
    >
      {/* Decorative background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 -z-1 pointer-events-none filter-[blur(60px)]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(76, 141, 255, 0.1) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-20 max-w-150" ref={titleRef}>
          <div className="inline-flex items-center font-(--font-mono) text-xs tracking-widest uppercase text-(--accent) mb-4 sm:mb-6 px-4 py-1.5 bg-(--accent-soft) border border-[rgba(76,141,255,0.2)] rounded-full shadow-[0_0_20px_rgba(76,141,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-(--accent)" />
            {t("testimonials.eyebrow")}
          </div>
          <h2 className="testimonials__title font-display text-[clamp(38px,4.5vw,64px)] lg:text-[64px] leading-[1.1] font-bold mb-4 sm:mb-5">
            <span className="title-glow">{t("testimonials.title_start")}</span>{" "}
            <span className="highlight">
              {t("testimonials.title_highlight")}
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-(--text-secondary) leading-[1.6]">
            {t("testimonials.subtitle")}
          </p>
        </div>

        {/* Grid of Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full perspective-[1500px]">
          {defaultTestimonials.map((testi, index) => (
            <div
              className="relative bg-[rgba(23,23,26,0.6)] backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-[box-shadow,border-color] duration-300 hover:-translate-y-2.5 hover:scale-[1.02] hover:border-[rgba(76,141,255,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_0_20px_rgba(76,141,255,0.1)] transform-3d"
              key={testi.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            >
              {/* Quote icon */}
              <div className="absolute top-5 sm:top-6 right-5 sm:right-6 pointer-events-none">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="var(--accent)"
                  opacity="0.2"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <p className="text-sm sm:text-base leading-[1.7] text-(--text-primary) italic mb-6 sm:mb-8 relative z-1">
                "{t(testi.contentKey)}"
              </p>

              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-[rgba(76,141,255,0.2)] to-[rgba(76,141,255,0.5)] flex items-center justify-center overflow-hidden border-2 border-white/10 shrink-0">
                  {testi.avatar ? (
                    <img
                      src={testi.avatar}
                      alt={t(testi.nameKey)}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="font-bold text-base sm:text-[18px] text-white">
                      {t(testi.nameKey).charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-sm sm:text-base text-white mb-0.5 sm:mb-1">
                    {t(testi.nameKey)}
                  </h4>
                  <span className="font-(--font-mono) text-[11px] sm:text-xs text-(--text-muted)">
                    {t(testi.roleKey)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
