import { useTranslation } from "react-i18next";

const HERO_MARQUEE_STYLES = `
@keyframes hero-marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-hero-marquee-scroll {
  animation: hero-marquee-scroll 32s linear infinite;
}
.animate-hero-marquee-scroll:hover {
  animation-play-state: paused;
}
`;

export default function HeroMarquee() {
  const { i18n } = useTranslation();
  const isFr = i18n.language?.startsWith("fr");

  const marqueeItems = isFr
    ? [
        "CRÉATIVITÉ DIGITALE",
        "FRONTEND & 3D WEB",
        "PERFORMANCE 100/100",
        "DESIGN SYSTEMS",
        "THREE.JS & GSAP",
        "FULLSTACK ARCHITECTURE",
        "REACT & NEXT.JS",
        "MICRO-INTERACTIONS",
      ]
    : [
        "DIGITAL CREATIVITY",
        "FRONTEND & 3D WEB",
        "100/100 PERFORMANCE",
        "DESIGN SYSTEMS",
        "THREE.JS & GSAP",
        "FULLSTACK ARCHITECTURE",
        "REACT & NEXT.JS",
        "MICRO-INTERACTIONS",
      ];

  const renderTrack = () => (
    <div className="flex items-center space-x-10 md:space-x-16 px-6 shrink-0">
      {marqueeItems.map((item, idx) => (
        <span key={idx} className="flex items-center space-x-8 md:space-x-12 shrink-0">
          <span className="text-white/85 tracking-[0.18em] transition-colors duration-300 hover:text-white hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.7)]">
            {item}
          </span>
          <span
            className="text-[var(--accent)] text-xl md:text-3xl drop-shadow-[0_0_12px_#4c8dff] select-none"
            aria-hidden="true"
          >
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden py-6 md:py-10 my-4 z-10 select-none">
      <style>{HERO_MARQUEE_STYLES}</style>

      {/* Horizontal banner wrapper with tall height, glassmorphism & accent glows */}
      <div className="relative w-full overflow-hidden border-y border-[rgba(76,141,255,0.28)] bg-gradient-to-r from-[rgba(16,17,22,0.92)] via-[rgba(24,26,36,0.96)] to-[rgba(16,17,22,0.92)] backdrop-blur-2xl py-7 md:py-10 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(76,141,255,0.15)] cursor-default">
        {/* Subtle accent edge glow lines */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-transparent to-blue-500/15 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60" />

        {/* Marquee Continuous Animated Track */}
        <div className="flex w-max animate-hero-marquee-scroll text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black font-[var(--font-display)] uppercase">
          {renderTrack()}
          {renderTrack()}
        </div>
      </div>
    </div>
  );
}

