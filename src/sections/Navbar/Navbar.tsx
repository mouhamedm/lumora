import { useEffect, useState } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Accueil', href: '#top' },
  { label: 'Expérience', href: '#experience' },
  { label: 'À propos', href: '#about' },
  { label: 'Projets', href: '#projects' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  // TODO: brancher un vrai i18n (react-i18next) plus tard.
  // Pour l'instant le bouton ne fait que basculer le label.
  const [lang, setLang] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__logo">
          MMD<span className="nav__logo-dot">.</span>DEV
        </a>

        <nav className="nav__links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav__link">
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button
            type="button"
            className="nav__lang"
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            aria-label="Changer la langue"
          >
            {lang === 'fr' ? 'EN' : 'FR'}
          </button>
          <a href="#contact" className="nav__cta">
            <span>Contactez-moi</span>
          </a>
        </div>
      </div>
    </header>
  );
}