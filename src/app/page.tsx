import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import ScrollShowcase from "@/components/ScrollShowcase";
import Projects from "@/components/Projects";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-lumora-bg text-lumora-dark relative">
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <ScrollShowcase />
      <Projects />
      <Stats />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}
