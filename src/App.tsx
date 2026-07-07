import { useState, useCallback } from 'react';
import Navbar from './sections/Navbar/Navbar';
import Hero from './sections/Hero/Hero';
import Competences from './sections/Competences/Competences';
import About from './sections/About/About';
import Projects from './sections/Projects/Projects';
import Testimonials from './sections/Testimonials/Testimonials';
import Contact from './sections/Contact/Contact';
import Footer from './sections/Footer/Footer';
import Preloader from './sections/Preloader/Preloader';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePreloaderStart = useCallback(() => setIsLoaded(true), []);
  const handlePreloaderComplete = useCallback(() => setIsLoading(false), []);

  return (
    <>
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