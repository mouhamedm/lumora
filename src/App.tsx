import { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from './sections/Navbar/Navbar';
import Hero from './sections/Hero/Hero';
import Competences from './sections/Competences/Competences';
import About from './sections/About/About';
import Projects from './sections/Projects/Projects';
import Testimonials from './sections/Testimonials/Testimonials';
import Contact from './sections/Contact/Contact';
import Footer from './sections/Footer/Footer';
import Preloader from './sections/Preloader/Preloader';
import CustomCursor from './components/CustomCursor/CustomCursor';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const preloaderStartedRef = useRef(false);
  const fontsReadyRef = useRef(false);

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
      {isLoading && (
        <Preloader
          onStart={handlePreloaderStart}
          onComplete={handlePreloaderComplete}
        />
      )}
      <Navbar isLoaded={isLoaded} />
      <Hero isLoaded={isLoaded} />
      <Competences />
      <About />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}

export default App;