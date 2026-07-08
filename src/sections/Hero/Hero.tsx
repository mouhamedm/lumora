import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import './Hero.css';

export interface HeroProps {
  isLoaded?: boolean;
}

const splitWords = (text: string) => {
  return text.split(' ').map((word, index) => (
    <span key={index} className="word-wrap" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}>
      <span className="word" style={{ display: 'inline-block', transformOrigin: 'left bottom' }}>
        {word}
      </span>
      {'\u00A0'}
    </span>
  ));
};

export default function Hero({ isLoaded = false }: HeroProps) {
  const { t } = useTranslation();
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const scene = sceneRef.current;
    if (!scene || cards.length === 0) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set('.hero__aurora, .hero__grid', { opacity: 0 });
      gsap.set('.hero__name-mask', { scaleX: 1 });
      gsap.set('.hero__role', { x: -60, opacity: 0, filter: isMobile ? 'none' : 'blur(8px)' });
      // On mobile, animating ~13 individual word spans at once (each forcing
      // its own compositor layer) is still enough concurrent work to stutter.
      // Treat the manifesto as a single block instead of a per-word cascade.
      if (isMobile) {
        gsap.set('.hero__manifesto', { y: 24, opacity: 0 });
        gsap.set('.word', { opacity: 1, y: 0, rotateZ: 0 });
      } else {
        gsap.set('.word', { opacity: 0, y: 40, rotateZ: 6 });
      }
      gsap.set('.hero__social-link', { opacity: 0, x: -20, scale: 0.7 });
      gsap.set('.hero__ctas > *', { opacity: 0, y: 30, scale: 0.95 });
      gsap.set(cards, { opacity: 0, x: 150 });

      if (!isLoaded) return;

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.to('.hero__aurora, .hero__grid', { opacity: 1, duration: 1.5 }, 0);

      tl.to('.hero__name-mask', {
        scaleX: 0,
        duration: 1.1,
        ease: 'power3.inOut',
      }, 0.1);

      tl.to(cards, {
        opacity: 1,
        x: 0,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.12,
      }, 0.15);

      tl.to('.hero__role', {
        x: 0,
        opacity: 1,
        filter: isMobile ? 'none' : 'blur(0px)',
        duration: 0.9,
      }, 0.5);

      if (isMobile) {
        tl.to('.hero__manifesto', {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
        }, 0.6);
      } else {
        tl.to('.word', {
          opacity: 1,
          y: 0,
          rotateZ: 0,
          duration: 0.8,
          stagger: 0.025,
        }, 0.6);
      }

      tl.to('.hero__social-link', {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(2)',
        clearProps: 'all',
      }, 0.75);

      tl.to('.hero__ctas > *', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        clearProps: 'all',
      }, 0.9);
    }, introRef);

    if (!isLoaded) return () => ctx.revert();

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // No pointer on touch devices, and the continuous float + backdrop-filter
    // cards are the heaviest ongoing compositor work on the page — skip them
    // on mobile instead of running them for no visual benefit.
    if (prefersReducedMotion || isMobile) {
      return () => ctx.revert();
    }

    const floaters = cards.map((card, i) =>
      gsap.to(card, {
        y: '+=14',
        duration: 2.4 + i * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
    );

    const setters = cards.map((_, i) => ({
      x: gsap.quickTo(cards[i], 'x', { duration: 0.6, ease: 'power3.out' }),
      rotY: gsap.quickTo(cards[i], 'rotateY', {
        duration: 0.6,
        ease: 'power3.out',
      }),
      strength: (i + 1) * 6,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = scene.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;

      setters.forEach((setter) => {
        setter.x(relX * setter.strength * 4);
        setter.rotY(relX * setter.strength);
      });
    };

    const handleMouseLeave = () => {
      setters.forEach((setter) => {
        setter.x(0);
        setter.rotY(0);
      });
    };

    scene.addEventListener('mousemove', handleMouseMove);
    scene.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      scene.removeEventListener('mousemove', handleMouseMove);
      scene.removeEventListener('mouseleave', handleMouseLeave);
      floaters.forEach((tween) => tween.kill());
      ctx.revert();
    };
  }, [isLoaded]);

  return (
    <section className="hero" id="top">
      {/* Aurora orbs */}
      <div className="hero__aurora" aria-hidden="true">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
      </div>

      {/* Grid overlay */}
      <div className="hero__grid" aria-hidden="true" />

      {/* LEFT */}
      <div className="hero__content" ref={introRef}>
        <h1 className="hero__name">
          {t('hero.name1')}<br />
          {t('hero.name2')} <br /> {t('hero.name3')}
          <span className="hero__name-mask" aria-hidden="true" />
        </h1>

        <p className="hero__role">{splitWords(t('hero.role'))}</p>

        <p className="hero__manifesto">
          {splitWords(t('hero.manifesto_start'))}
          <span className="highlight">{splitWords(t('hero.manifesto_modern'))}</span>
          {splitWords(t('hero.manifesto_and'))}
          <span className="highlight">{splitWords(t('hero.manifesto_perf'))}</span>
          {splitWords(t('hero.manifesto_end'))}
        </p>

        {/* Socials */}
        <div className="hero__socials">
          <a
            href="https://github.com/Mourtada-002"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hero__social-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.44-2.7 5.42-5.27 5.7.42.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/mouhamedmdicko/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="hero__social-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
            </svg>
          </a>
          <a
            href="mailto:mmddev310@gmail.com"
            aria-label="Email"
            className="hero__social-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M3 6h18v12H3z" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
        </div>

        {/* CTAs */}
        <div className="hero__ctas">
          <a href="/cv-mouhamed-dicko.pdf" className="hero__cv" download="CV_Mouhamed_Dicko.pdf">
            {t('hero.download_cv')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 3v13m0 0-4-4m4 4 4-4M4 21h16" />
            </svg>
          </a>
          <a href="#projects" className="hero__scroll">
            {t('hero.view_projects')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hero__right">
        <div className="hero__scene" ref={sceneRef}>
          {/* Main IDE */}
          <div className="code-card code-card--main" ref={(el) => { cardRefs.current[0] = el; }}>
            <div className="code-card__bar">
              <span className="dot dot--red" />
              <span className="dot dot--yellow" />
              <span className="dot dot--green" />
            </div>
            <pre className="code-card__body">
              <span className="tok-keyword">const</span> <span className="tok-fn">Developer</span> = () =&gt; {'{'}
              {'\n  '}
              <span className="tok-keyword">const</span> [passion, setPassion] = <span className="tok-fn">useState</span>(<span className="tok-keyword">true</span>);
              {'\n  '}
              <span className="tok-keyword">return</span> (
              {'\n    '}&lt;<span className="tok-fn">div</span> <span className="tok-string">className</span>=<span className="tok-string">"code"</span>&gt;
              {'\n      {'} passion &amp;&amp; &lt;<span className="tok-fn">BuildIdeas</span> /&gt; {'}'}
              {'\n      '}&lt;<span className="tok-fn">CreateImpact</span> /&gt;
              {'\n    '}&lt;/<span className="tok-fn">div</span>&gt;
              {'\n  '});
              {'\n'};
            </pre>
          </div>

          {/* Card: Expérience */}
          <div className="hero__float-card hero__float-card--exp" ref={(el) => { cardRefs.current[1] = el; }}>
            <span className="float-card__title">{t('hero.exp_title')}</span>
            <div className="float-card__value">3+</div>
            <span className="float-card__sub">{t('hero.exp_sub')}</span>
            <div className="float-card__chart">
              <svg viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M0 15 Q 10 10 15 15 T 30 10 T 40 5 L 50 0" stroke="var(--accent)"/>
              </svg>
            </div>
          </div>

          {/* Card: Projets */}
          <div className="hero__float-card hero__float-card--proj" ref={(el) => { cardRefs.current[2] = el; }}>
            <span className="float-card__title">{t('hero.proj_title')}</span>
            <div className="float-card__value">10+</div>
            <span className="float-card__sub">{t('hero.proj_sub')}</span>
            <div className="float-card__icon">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
               </svg>
            </div>
          </div>

          {/* Card: Focus */}
          <div className="hero__float-card hero__float-card--focus" ref={(el) => { cardRefs.current[3] = el; }}>
            <span className="float-card__title">{t('hero.focus_title')}</span>
            <ul className="float-card__list">
              <li>UI / UX</li>
              <li>Performance</li>
              <li>Accessibilité</li>
            </ul>
          </div>
          
          {/* Floating symbols */}
          <div className="hero__symbol hero__symbol--code">&lt;/&gt;</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a href="#experience" className="hero__scroll-indicator" aria-label="Scroll down">
        <span>{t('hero.scroll')}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-6-6m6 6l6-6" />
        </svg>
      </a>
    </section>
  );
}