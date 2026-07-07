import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aproposImg from '../../assets/images/apropos-img.webp';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = window.innerWidth < 768;

    // 1. Text Animations (Reveal)
    const title = titleRef.current;
    const lines = linesRef.current.filter(Boolean);

    if (title) {
      gsap.fromTo(
        title,
        { opacity: 0, y: 40, filter: isMobile ? 'none' : 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: isMobile ? 'none' : 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        }
      );
    }

    if (lines.length > 0) {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 20, filter: isMobile ? 'none' : 'blur(5px)' },
        {
          opacity: 1,
          y: 0,
          filter: isMobile ? 'none' : 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
          },
        }
      );
    }

    // 2. Image 3D Tilt Effect
    const imageWrapper = imageWrapperRef.current;
    const imageInner = imageInnerRef.current;

    if (imageWrapper && imageInner) {
      const xTo = gsap.quickTo(imageInner, 'rotationY', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(imageInner, 'rotationX', { duration: 0.5, ease: 'power3.out' });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = imageWrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        xTo(x * 30);
        yTo(-y * 30);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
        gsap.to(imageInner, { rotationX: 0, rotationY: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
      };

      imageWrapper.addEventListener('mousemove', handleMouseMove);
      imageWrapper.addEventListener('mouseleave', handleMouseLeave);

      // Scroll entrance for image
      gsap.fromTo(
        imageWrapper,
        { opacity: 0, scale: 0.8, rotationY: -30 },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
          },
        }
      );

      // Cleanup
      return () => {
        imageWrapper.removeEventListener('mousemove', handleMouseMove);
        imageWrapper.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      
      xTo(relX * 0.3);
      yTo(relY * 0.3);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Floating badges animation
  useEffect(() => {
    const badges = badgeRefs.current.filter(Boolean);
    badges.forEach((badge, index) => {
      gsap.to(badge, {
        y: '+=15',
        rotation: index % 2 === 0 ? 5 : -5,
        duration: 2 + index,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="about__container">
        
        {/* LEFT COLUMN: Image & Visuals */}
        <div className="about__visuals">
          <div className="about__image-wrapper" ref={imageWrapperRef}>
            <div className="about__glow-orb" />
            <div className="about__image-inner" ref={imageInnerRef}>
              <img src={aproposImg} alt="À propos de moi" className="about__image" />
            </div>

            {/* Floating Badges */}
            <div className="about__floating-badge badge-1" ref={(el) => { badgeRefs.current[0] = el; }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <div className="about__floating-badge badge-2" ref={(el) => { badgeRefs.current[1] = el; }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Content */}
        <div className="about__content">
          <div className="about__eyebrow">{t('about.eyebrow')}</div>
          
          <h2 className="about__title" ref={titleRef}>
            {t('about.title_start')}<span className="highlight">{t('about.title_highlight')}</span>{t('about.title_end')}
          </h2>
          
          <div className="about__description">
            <p className="about__description-line" ref={(el) => { linesRef.current[0] = el; }}>
              {t('about.p1')}
            </p>
            <p className="about__description-line" ref={(el) => { linesRef.current[1] = el; }}>
              {t('about.p2')}
            </p>
            <p className="about__description-line" ref={(el) => { linesRef.current[2] = el; }}>
              {t('about.p3')}
            </p>
          </div>

          <div className="about__actions">
            <a href="https://wa.me/2250719076206" target="_blank" rel="noopener noreferrer" className="btn-magnetic" ref={btnRef}>
              <span>{t('about.cta')}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
