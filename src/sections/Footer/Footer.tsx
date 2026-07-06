import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import githubIcon from '../../assets/icons/github-icon.svg';
import linkedinIcon from '../../assets/icons/linkedin_icon.svg';
import whatsappIcon from '../../assets/icons/whatsapp-icon.svg';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const { t } = useTranslation();
  const footerRef = useRef<HTMLElement>(null);
  const textFillRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const textFill = textFillRef.current;
    const dock = dockRef.current;

    if (!footer || !textFill || !dock) return;

    let ctx = gsap.context(() => {
      // Scrub animation for the massive text
      gsap.to(textFill, {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom', // Start when the top of footer hits bottom of viewport
          end: 'bottom bottom', // End when bottom of footer hits bottom of viewport
          scrub: 1, // Smooth scrubbing
        }
      });

      // Entrance animation for dock
      gsap.fromTo(dock,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: footer,
            start: 'top 80%',
          }
        }
      );
    }, footerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      
      {/* Social Dock */}
      <div className="footer__dock-container" ref={dockRef}>
        <div className="footer__dock">
          <a href="https://github.com/Mourtada-002" target="_blank" rel="noreferrer" className="footer__dock-item" aria-label="GitHub">
            <img src={githubIcon} alt="GitHub" />
          </a>
          <a href="https://www.linkedin.com/in/mouhamedmdicko/" target="_blank" rel="noreferrer" className="footer__dock-item" aria-label="LinkedIn">
            <img src={linkedinIcon} alt="LinkedIn" />
          </a>
          <a href="https://wa.me/2250719076206" target="_blank" rel="noreferrer" className="footer__dock-item" aria-label="WhatsApp">
            <img src={whatsappIcon} alt="WhatsApp" />
          </a>
        </div>
      </div>

      {/* Massive Text Background */}
      <div className="footer__text-wrapper" aria-hidden="true">
        <h2 className="footer__text">
          MMD DEV
          <div className="footer__text-fill" ref={textFillRef}>
            MMD DEV
          </div>
        </h2>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="footer__copyright">
          © {new Date().getFullYear()} Mouhamed Mourtada Dicko. {t('footer.rights')}
        </div>
        <div className="footer__status">
          <div className="footer__status-dot"></div>
          {t('footer.status')}
        </div>
      </div>
    </footer>
  );
}
