import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const formRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"" | "SUCCESS" | "ERROR" | "LOADING">("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("LOADING");
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/mjgqllyl", {
        method: "POST",
        body: data,
        headers: {
            'Accept': 'application/json'
        }
      });
      if (response.ok) {
        setStatus("SUCCESS");
        form.reset();
      } else {
        setStatus("ERROR");
      }
    } catch (error) {
      setStatus("ERROR");
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx = gsap.context(() => {
      // Title words reveal
      const title = titleRef.current;
      if (title) {
        const inners = title.querySelectorAll('.word-inner');
        gsap.fromTo(inners, 
          { y: '100%' },
          {
            y: '0%',
            duration: 1,
            ease: 'power4.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
            }
          }
        );
      }

      // Cards reveal
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
              trigger: section,
              start: 'top 65%',
            }
          }
        );

        // Mouse tracking for cards border glow
        const handleMouseMove = (e: MouseEvent, card: HTMLElement) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        };

        cards.forEach(card => {
          if (!card) return;
          card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
        });
      }

      // Form reveal
      const form = formRef.current;
      if (form) {
        gsap.fromTo(form,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
            }
          }
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="contact__container">
        
        {/* Left Side: Info */}
        <div className="contact__info">
          <div className="contact__eyebrow">{t('contact.eyebrow')}</div>
          <h2 className="contact__title" ref={titleRef}>
            <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em' }}>
              <span className="word-inner" style={{ display: 'inline-block' }}>{t('contact.title_start')}</span>
            </span>
            <span style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.25em' }}>
              <span className="word-inner text-gradient-blue" style={{ display: 'inline-block' }}>{t('contact.title_highlight')}</span>
            </span>
            <span style={{ display: 'inline-block', overflow: 'hidden' }}>
              <span className="word-inner text-gradient-blue" style={{ display: 'inline-block' }}>{t('contact.title_end')}</span>
            </span>
          </h2>

          <div className="contact__cards">
            {/* Email Card */}
            <a href="mailto:mmddev310@gmail.com" className="contact-card" style={{ textDecoration: 'none' }} ref={el => { cardsRef.current[0] = el; }}>
              <div className="contact-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="contact-card__details">
                <span className="contact-card__label">{t('contact.email_label')}</span>
                <span className="contact-card__value">mmddev310@gmail.com</span>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a href="https://wa.me/2250719076206" target="_blank" rel="noreferrer" className="contact-card" style={{ textDecoration: 'none' }} ref={el => { cardsRef.current[1] = el; }}>
              <div className="contact-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="contact-card__details">
                <span className="contact-card__label">{t('contact.whatsapp_label')}</span>
                <span className="contact-card__value">+225 0719076206</span>
              </div>
            </a>

            {/* Location Card */}
            <div className="contact-card" ref={el => { cardsRef.current[2] = el; }}>
              <div className="contact-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="contact-card__details">
                <span className="contact-card__label">{t('contact.location_label')}</span>
                <span className="contact-card__value">{t('contact.location_val')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact__form-wrapper" ref={formRef}>
          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="email" id="email" name="email" className="form-input" placeholder=" " required />
              <label htmlFor="email" className="form-label">{t('contact.form_email')}</label>
            </div>
            
            <div className="form-group">
              <textarea id="message" name="message" className="form-input" placeholder=" " required></textarea>
              <label htmlFor="message" className="form-label">{t('contact.form_message')}</label>
            </div>

            <button type="submit" className="contact__submit" disabled={status === "LOADING"}>
              {status === "LOADING" ? t('contact.btn_loading') : t('contact.btn_submit')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
            
            {status === "SUCCESS" && (
              <p style={{ color: '#57ab5a', marginTop: '16px', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                {t('contact.msg_success')}
              </p>
            )}
            {status === "ERROR" && (
              <p style={{ color: '#e5534b', marginTop: '16px', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                {t('contact.msg_error')}
              </p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
