import React, { useState } from 'react';
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

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      {/* The rest of the site is always rendered so that images load in the background, 
          but GSAP inside Preloader blocks scrolling initially */}
      <Navbar />
      <Hero />
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