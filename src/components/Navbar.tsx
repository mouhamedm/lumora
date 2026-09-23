import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";

const NAV_LINKS = [
  { key: "nav.services", href: "#what-i-do" },
  { key: "nav.experience", href: "#experience" },
  { key: "nav.projects", href: "#projects" },
  { key: "nav.testimonials", href: "#testimonials" },
  { key: "nav.contact", href: "#contact" },
];

export interface NavbarProps {
  isLoaded?: boolean;
  isMenuOpen?: boolean;
  setIsMenuOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export default function Navbar({
  isLoaded = false,
  isMenuOpen: externalMenuOpen,
  setIsMenuOpen: externalSetIsMenuOpen,
}: NavbarProps) {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const setIsMenuOpen = externalSetIsMenuOpen !== undefined ? externalSetIsMenuOpen : setInternalMenuOpen;
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "fr";

  const toggleLanguage = () => {
    const newLang = currentLang === "fr" ? "en" : "fr";
    i18n.changeLanguage(newLang);
  };

  // Entrance Animation
  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      if (!isLoaded) {
        gsap.set(".nav__logo", { x: -30, opacity: 0 });
        gsap.set(".nav__link", { y: -20, opacity: 0 });
        gsap.set(".nav__actions > *", { x: 30, opacity: 0 });
      } else {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            ".nav__logo",
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8 },
            0.2,
          )
          .fromTo(
            ".nav__link",
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
            0.3,
          )
          .fromTo(
            ".nav__actions > *",
            { x: 30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
            0.3,
          );
      }
    }, navRef);

    if (!isLoaded) return () => ctx.revert();
  }, [isLoaded]);

  // Menu Animation
  useEffect(() => {
    if (!menuRef.current) return;

    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        gsap.set(menuRef.current, { display: "flex" });

        const tl = gsap.timeline();

        tl.fromTo(
          menuRef.current,
          {
            clipPath: "circle(0% at 90% 10%)",
            backgroundColor: "rgba(11, 11, 12, 0)",
          },
          {
            clipPath: "circle(150% at 90% 10%)",
            backgroundColor: "#0b0b0c",
            duration: 0.8,
            ease: "power4.inOut",
          },
        );

        tl.fromTo(
          ".mobile-nav__link",
          { y: 60, opacity: 0, rotationZ: 5 },
          {
            y: 0,
            opacity: 1,
            rotationZ: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "back.out(1.5)",
          },
          "-=0.4",
        );

        tl.fromTo(
          ".mobile-nav__cta",
          { scale: 0.8, opacity: 0, y: 20 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.4",
        );

        document.body.style.overflow = "hidden";
      } else {
        gsap.to(menuRef.current, {
          clipPath: "circle(0% at 90% 10%)",
          backgroundColor: "rgba(11, 11, 12, 0)",
          duration: 0.6,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(menuRef.current, { display: "none" });
          },
        });
        document.body.style.overflow = "";
      }
    }, menuRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  return (
    <header
      ref={navRef}
      className="absolute top-0 left-0 right-0 z-100 py-6 border-b border-transparent"
    >
      <div className="nav__inner w-full max-w-7xl mx-auto px-12 flex items-center justify-between max-[860px]:px-6">
        {/* Logo */}
        <a
          href="#top"
          className="nav__logo font-(--font-display) text-[34px] tracking-[-0.02em] no-underline text-(--text-primary) inline-flex items-baseline relative transition-opacity duration-250 hover:opacity-85 max-[860px]:text-[24px]"
        >
          <span className="text-(--text-primary)">MMD</span>
          <span className="text-(--accent)">.</span>
          <span className="logo-dev-text">DEV</span>
        </a>

        {/* Desktop nav links */}
        <nav className="nav__links flex items-center gap-1.5 max-[860px]:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav__link nav-link-cool no-underline"
            >
              <span className="relative z-1">{t(link.key)}</span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="nav__actions flex items-center gap-4">
          <button
            type="button"
            className="font-(--font-mono) text-xs sm:text-[14px] tracking-[0.08em] text-(--text-primary) bg-white/5 border border-(--text-primary) rounded-md sm:rounded-lg px-2.5 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md transition-all duration-300 hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent-soft) hover:shadow-[0_0_20px_rgba(76,141,255,0.3)] hover:-translate-y-0.5 cursor-pointer"
            onClick={toggleLanguage}
            aria-label="Changer la langue"
          >
            {currentLang === "fr" ? "EN" : "FR"}
          </button>

          {/* Burger Button */}
          <button
            type="button"
            className={[
              "hidden max-[860px]:flex flex-col justify-center items-center w-11 h-11",
              "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl z-130 relative gap-1.5",
              "transition-[background-color,border-color] duration-300",
              "hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] cursor-pointer",
            ].join(" ")}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span
              className={[
                "w-5 h-0.5 bg-(--text-primary) rounded-sm transition-transform duration-400 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]",
                isMenuOpen ? "translate-y-1 rotate-45" : "",
              ].join(" ")}
            />
            <span
              className={[
                "w-5 h-0.5 bg-(--text-primary) rounded-sm transition-transform duration-400 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]",
                isMenuOpen ? "-translate-y-1 -rotate-45" : "",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <div
        className="mobile-nav fixed inset-0 w-full h-dvh z-120 hidden flex-col justify-center items-center bg-[#0b0b0c] backdrop-blur-xl [clip-path:circle(0%_at_90%_10%)] touch-none overscroll-contain"
        ref={menuRef}
      >
        <div className="flex flex-col items-center gap-12 w-full">
          <nav className="mobile-nav__links flex flex-col items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-nav__link mobile-nav-link font-(--font-display) text-[34px] text-(--text-primary) no-underline text-center transition-transform duration-300 hover:scale-105 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{t(link.key)}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
