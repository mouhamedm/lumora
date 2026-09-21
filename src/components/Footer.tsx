import { useEffect, useRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import githubIcon from '../assets/icons/github-icon.svg';
import linkedinIcon from '../assets/icons/linkedin_icon.svg';
import whatsappIcon from '../assets/icons/whatsapp.svg';

// Register ScrollTrigger safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. INLINE STYLES FOR FOOTER (Harmonized with app tokens)
// -------------------------------------------------------------------------
const FOOTER_STYLES = `
@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 35s linear infinite;
}

/* Glass Pill Theming aligned with dark theme */
.footer-glass-pill {
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(76, 141, 255, 0.4);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(76, 141, 255, 0.2);
  color: #FFFFFF;
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-family: var(--font-display, 'Space Grotesk', sans-serif);
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  -webkit-background-clip: text;
  background-clip: text;
  pointer-events: none;
  user-select: none;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 25px rgba(76, 141, 255, 0.25));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

export const MagneticButton = forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = 'button', ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: 'power2.out',
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: 'elastic.out(1, 0.3)',
            duration: 1.2,
          });
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          element.removeEventListener('mousemove', handleMouseMove);
          element.removeEventListener('mouseleave', handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          if (node) {
            (localRef as React.MutableRefObject<HTMLElement | null>).current = node;
            if (typeof forwardedRef === 'function') forwardedRef(node);
            else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        }}
        className={cn('cursor-pointer', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = 'MagneticButton';

// -------------------------------------------------------------------------
// 3. MAIN UNIFIED FOOTER COMPONENT
// -------------------------------------------------------------------------
export default function Footer() {
  const { t, i18n } = useTranslation();
  const footerRef = useRef<HTMLElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const isFr = i18n.language === 'fr';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax text background on scroll
      if (giantTextRef.current) {
        gsap.fromTo(
          giantTextRef.current,
          { y: 60, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 85%',
              end: 'bottom bottom',
              scrub: 1,
            },
          }
        );
      }

      // Staggered reveal for heading and action pills
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 75%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const marqueeItems = isFr
    ? [
        'Développement Full Stack',
        'UI/UX & Design Créatif',
        'React & TypeScript',
        'GSAP & Animations Fluides',
        'Architecture Web Moderne',
        'Performance & SEO Optimal',
      ]
    : [
        'Full Stack Development',
        'Creative UI/UX Design',
        'React & TypeScript',
        'GSAP & Fluid Motion',
        'Modern Web Architecture',
        'High Performance & SEO',
      ];

  const primaryActions = [
    {
      label: 'GitHub',
      href: 'https://github.com/mouhamedm',
      icon: (
        <img
          src={githubIcon}
          alt="GitHub"
          className="w-5 h-5 brightness-90 group-hover:brightness-100 transition-all duration-300"
          loading="lazy"
        />
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mouhamedm/',
      icon: (
        <img
          src={linkedinIcon}
          alt="LinkedIn"
          className="w-5 h-5 brightness-90 group-hover:brightness-100 transition-all duration-300"
          loading="lazy"
        />
      ),
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/2250719076206',
      icon: (
        <img
          src={whatsappIcon}
          alt="WhatsApp"
          className="w-5 h-5 brightness-90 group-hover:brightness-100 transition-all duration-300"
          loading="lazy"
        />
      ),
    },
  ];

  const secondaryLinks = [
    { label: isFr ? 'Accueil' : 'Home', href: '#hero' },
    { label: isFr ? 'Compétences' : 'Skills', href: '#skills' },
    { label: isFr ? 'À propos' : 'About', href: '#about' },
    { label: isFr ? 'Projets' : 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const renderMarquee = () => (
    <div className="flex items-center space-x-12 px-6">
      {marqueeItems.map((item, idx) => (
        <span key={idx} className="flex items-center space-x-4">
          <span>{item}</span>
          <span className="text-[var(--accent)] opacity-70">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FOOTER_STYLES }} />

      {/* Unified footer with the exact same background atmosphere as Contact */}
      <footer
        ref={footerRef}
        className="relative w-full h-screen min-h-screen flex flex-col justify-between overflow-hidden pt-12 md:pt-16 pb-6 md:pb-8 z-[2] bg-transparent text-[var(--text-primary)]"
      >
        {/* Giant background brand text with subtle stroke and parallax */}
        <div
          ref={giantTextRef}
          className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
        >
          MMD DEV
        </div>

        {/* 1. Diagonal Sleek Marquee */}
        <div className="relative w-full overflow-hidden border-y border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md py-3.5 z-10 -rotate-1 scale-105 shadow-xl">
          <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.25em] text-[var(--text-muted)] uppercase font-[var(--font-mono)]">
            {renderMarquee()}
            {renderMarquee()}
          </div>
        </div>

        {/* 2. Main Center Content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 my-16 w-full max-w-5xl mx-auto">
          <h2
            ref={headingRef}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black footer-text-glow font-[var(--font-display)] tracking-tight mb-8 md:mb-12 text-center"
          >
            {isFr ? 'Prêt à collaborer ?' : 'Ready to create?'}
          </h2>

          {/* Interactive Magnetic Pills Layout */}
          <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
            {/* Social & Contact Actions */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
              {primaryActions.map((action, idx) => (
                <MagneticButton
                  key={idx}
                  as="a"
                  href={action.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="footer-glass-pill px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-[var(--text-primary)] font-bold text-sm md:text-base flex items-center gap-3 group"
                >
                  {action.icon}
                  {action.label}
                </MagneticButton>
              ))}
            </div>

            {/* Navigation Quick Links */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 w-full mt-2">
              {secondaryLinks.map((link, idx) => (
                <MagneticButton
                  key={idx}
                  as="a"
                  href={link.href}
                  className="footer-glass-pill px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-[var(--text-secondary)] font-medium text-xs md:text-sm hover:text-white"
                >
                  {link.label}
                </MagneticButton>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar / Copyright & Status */}
        <div className="relative z-20 w-full border-t border-[rgba(255,255,255,0.06)] pt-6 pb-6">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="font-[var(--font-mono)] text-[11px] md:text-xs text-[var(--text-muted)] text-center md:text-left">
              © {new Date().getFullYear()} Mouhamed Mourtada Dicko. {t('footer.rights')}
            </div>

            {/* Real-time Status Badge */}
            <div className="flex items-center gap-2.5 font-[var(--font-mono)] text-xs text-[var(--text-secondary)]">
              <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981] animate-pulse-green" />
              <span>{t('footer.status')}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export { Footer as CinematicFooter };
