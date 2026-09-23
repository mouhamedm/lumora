import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HeroMarquee from "./components/HeroMarquee";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import WhatsAppButton from "./components/WhatsAppButton";


const WhatIDo = lazy(() => import("./components/WhatIDo"));
const Experience = lazy(() => import("./components/Experience"));
const Projects = lazy(() => import("./components/Projects"));
const Skills = lazy(() => import("./components/Skills"));
const About = lazy(() => import("./components/About"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const preloaderStartedRef = useRef(false);
  const fontsReadyRef = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isEn = i18n.language && i18n.language.startsWith("en");
    document.title = isEn
      ? "MMD.Dev - Frontend Developer | Mouhamed Mourtada Dicko"
      : "MMD.Dev - Développeur Frontend | Mouhamed Mourtada Dicko";
    document.documentElement.lang = isEn ? "en" : "fr";
  }, [i18n.language]);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    let updateTicker: ((time: number) => void) | null = null;

    if (!isTouch) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.95,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      updateTicker = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(500, 33);
    }


    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#")) {
        if (href === "#top") {
          e.preventDefault();
          if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { duration: 1.3 });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } else if (href.length > 1) {
          const element = document.querySelector(href);
          if (element) {
            e.preventDefault();
            if (lenisRef.current) {
              lenisRef.current.scrollTo(element as HTMLElement, {
                offset: -20,
                duration: 1.3,
              });
            } else {
              const top =
                element.getBoundingClientRect().top + window.scrollY - 20;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);


    return () => {
      document.removeEventListener("click", handleAnchorClick);
      if (updateTicker) {
        gsap.ticker.remove(updateTicker);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (isMenuOpen) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isMenuOpen]);

  const revealHero = useCallback(() => {
    if (preloaderStartedRef.current && fontsReadyRef.current) {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const markReady = () => {
      if (cancelled) return;
      fontsReadyRef.current = true;
      revealHero();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    if ("fonts" in document) {
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]).then(markReady);
    } else {
      markReady();
    }

    return () => {
      cancelled = true;
    };
  }, [revealHero]);

  const handlePreloaderStart = useCallback(() => {
    preloaderStartedRef.current = true;
    revealHero();
  }, [revealHero]);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
  }, []);

  return (
    <>
      <CustomCursor />
      <WhatsAppButton isLoaded={isLoaded} isMenuOpen={isMenuOpen} />
      {isLoading && (
        <Preloader
          onStart={handlePreloaderStart}
          onComplete={handlePreloaderComplete}
        />
      )}
      <Navbar
        isLoaded={isLoaded}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <Hero isLoaded={isLoaded} />
      <HeroMarquee />
      <Suspense fallback={null}>
        <WhatIDo />
        <Experience />
        <Projects />
        <Skills />
        <About />
        <Testimonials />
        <Contact />
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
