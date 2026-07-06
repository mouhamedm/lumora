import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import './Navbar.css';

const NAV_LINKS = [
  { key: 'nav.home', href: '#top' },
  { key: 'nav.skills', href: '#competences' },
  { key: 'nav.about', href: '#about' },
  { key: 'nav.projects', href: '#projects' },
  { key: 'nav.contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith('en') ? 'en' : 'fr';

  const toggleLanguage = () => {
    const newLang = currentLang === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 24);

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Menu Animation
  useEffect(() => {
    if (!menuRef.current) return;
    
    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        gsap.set(menuRef.current, { display: 'flex' });
        
        const tl = gsap.timeline();
        
        // Reveal overlay with clipPath
        tl.fromTo(menuRef.current,
          { clipPath: 'circle(0% at 90% 10%)', backgroundColor: 'rgba(11, 11, 12, 0)' },
          { clipPath: 'circle(150% at 90% 10%)', backgroundColor: 'rgba(11, 11, 12, 0.96)', duration: 0.8, ease: 'power4.inOut' }
        );
        
        // Stagger links
        tl.fromTo('.mobile-nav__link',
          { y: 60, opacity: 0, rotationZ: 5 },
          { y: 0, opacity: 1, rotationZ: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(1.5)' },
          '-=0.4'
        );

        // CTA pop
        tl.fromTo('.mobile-nav__cta',
          { scale: 0.8, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' },
          '-=0.4'
        );
        
        document.body.style.overflow = 'hidden';
      } else {
        gsap.to(menuRef.current, {
          clipPath: 'circle(0% at 90% 10%)',
          backgroundColor: 'rgba(11, 11, 12, 0)',
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => {
            gsap.set(menuRef.current, { display: 'none' });
          }
        });
        document.body.style.overflow = '';
      }
    }, menuRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${hidden ? 'nav--hidden' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__logo">
          MMD<span className="nav__logo-dot">.</span>DEV
        </a>

        <nav className="nav__links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav__link">
              <span>{t(link.key)}</span>
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            type="button"
            className="nav__lang"
            onClick={toggleLanguage}
            aria-label="Changer la langue"
          >
            {currentLang === 'fr' ? 'EN' : 'FR'}
          </button>
          
          <a href="https://wa.me/2250719076206" className="nav__cta desktop-cta" target="_blank" rel="noopener noreferrer">
            <span>{t('nav.cta')}</span>
          </a>

          {/* Burger Button */}
          <button 
            className={`nav__burger ${isMenuOpen ? 'nav__burger--open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line" style={{ display: 'none' }}></span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <div className="mobile-nav" ref={menuRef}>
        <div className="mobile-nav__content">
          <nav className="mobile-nav__links">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="mobile-nav__link"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{t(link.key)}</span>
              </a>
            ))}
          </nav>
          
          <div className="mobile-nav__footer">
            <a 
              href="https://wa.me/2250719076206" 
              className="mobile-nav__cta" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{t('nav.cta')}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}