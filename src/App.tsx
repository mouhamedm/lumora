import { useState, useCallback, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HeroMarquee from './components/HeroMarquee';
import WhatIDo from './components/WhatIDo';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const preloaderStartedRef = useRef(false);
  const fontsReadyRef = useRef(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scroll with Lenis synchronized with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    ScrollTrigger.config({ ignoreMobileResize: true });
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Smooth navigation on internal anchor clicks
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        if (href === '#top') {
          e.preventDefault();
          lenis.scrollTo(0, { duration: 1.3 });
        } else if (href.length > 1) {
          const element = document.querySelector(href);
          if (element) {
            e.preventDefault();
            lenis.scrollTo(element as HTMLElement, { offset: -20, duration: 1.3 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause Lenis smooth scrolling when mobile overlay menu is open
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
    };

    if ('fonts' in document) {
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
  const handlePreloaderComplete = useCallback(() => setIsLoading(false), []);

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
      <WhatIDo />
      <Experience />
      <Projects />
      <Skills />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

export default App;