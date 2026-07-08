import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

const defaultTestimonials = [
  {
    id: 1,
    nameKey: 'testimonials.t1_name',
    roleKey: 'testimonials.t1_role',
    contentKey: 'testimonials.t1_text',
    avatar: '',
  },
  {
    id: 2,
    nameKey: 'testimonials.t2_name',
    roleKey: 'testimonials.t2_role',
    contentKey: 'testimonials.t2_text',
    avatar: '',
  },
  {
    id: 3,
    nameKey: 'testimonials.t3_name',
    roleKey: 'testimonials.t3_role',
    contentKey: 'testimonials.t3_text',
    avatar: '',
  }
];

export default function Testimonials() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    if (!section || !title || cards.length === 0) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(
        title.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 100, rotationY: 30, rotationX: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
            },
            delay: i * 0.2,
          }
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="testimonials" id="testimonials" ref={sectionRef}>
      
      {/* Decorative background elements */}
      <div className="testimonials__bg-glow" aria-hidden="true" />

      <div className="testimonials__container">
        <div className="testimonials__header" ref={titleRef}>
          <div className="testimonials__eyebrow">{t('testimonials.eyebrow')}</div>
          <h2 className="testimonials__title">{t('testimonials.title_start')} <span className="highlight">{t('testimonials.title_highlight')}</span></h2>
          <p className="testimonials__subtitle">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="testimonials__grid">
          {defaultTestimonials.map((testi, index) => (
            <div 
              className="testimonial-card"
              key={testi.id}
              ref={(el) => { cardRefs.current[index] = el; }}
            >
              <div className="testimonial-card__quote">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--accent)" opacity="0.2">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <p className="testimonial-card__content">"{t(testi.contentKey)}"</p>
              
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar">
                  {testi.avatar ? (
                    <img src={testi.avatar} alt={t(testi.nameKey)} loading="lazy" decoding="async" />
                  ) : (
                    <span>{t(testi.nameKey).charAt(0)}</span>
                  )}
                </div>
                <div className="testimonial-card__info">
                  <h4 className="testimonial-card__name">{t(testi.nameKey)}</h4>
                  <span className="testimonial-card__role">{t(testi.roleKey)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
