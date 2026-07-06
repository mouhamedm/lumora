import Navbar from './sections/Navbar/Navbar';
import Hero from './sections/Hero/Hero';
import Competences from './sections/Competences/Competences';
import About from './sections/About/About';
import Projects from './sections/Projects/Projects';
import Testimonials from './sections/Testimonials/Testimonials';
import Contact from './sections/Contact/Contact';
import Footer from './sections/Footer/Footer';

function App() {
  return (
    <>
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