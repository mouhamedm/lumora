import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';

// Images imports
import idconsultImg from '../../assets/images/idconsult.png';
import immoAppartImg from '../../assets/images/immo-appart.png';
import prestigeDiningImg from '../../assets/images/prestige-dining.png';
import mokaNoirImg from '../../assets/images/moka-noir.png';
import empiregymImg from '../../assets/images/empiregym.png';

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    id: 1,
    titleKey: 'projects.p1_title',
    descKey: 'projects.p1_desc',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GSAP', 'Lottie'],
    image: idconsultImg,
    link: 'https://www.idconsult-ml.com/',
  },
  {
    id: 2,
    titleKey: 'projects.p2_title',
    descKey: 'projects.p2_desc',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
    image: immoAppartImg,
    link: 'https://immo-appart.netlify.app/',
  },
  {
    id: 3,
    titleKey: 'projects.p3_title',
    descKey: 'projects.p3_desc',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
    image: prestigeDiningImg,
    link: 'https://prestige-dining.vercel.app/',
  },
  {
    id: 4,
    titleKey: 'projects.p4_title',
    descKey: 'projects.p4_desc',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
    image: mokaNoirImg,
    link: 'https://moka-noir.vercel.app/',
  },
  {
    id: 5,
    titleKey: 'projects.p5_title',
    descKey: 'projects.p5_desc',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
    image: empiregymImg,
    link: 'https://empiregym.vercel.app/',
  }
];

export default function Projects() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    // Proper GSAP cleanup for React 18 Strict Mode
    let ctx = gsap.context(() => {
      // Calculer la distance de scroll horizontale nécessaire
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        // On décale la piste vers la gauche d'une valeur égale à la largeur débordante de la fenêtre
        return -(trackWidth - window.innerWidth + 96); 
      };

      // 1. Animation principale : Pin & glissement horizontal
      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top", // Dès que le haut de la section touche le haut de l'écran
          end: () => `+=${track.scrollWidth}`, // La durée du scroll = la largeur de tous les projets
          pin: true, // Bloque la section à l'écran
          scrub: 1, // Mouvement lié au scroll de la souris (fluidifié avec 1s)
          invalidateOnRefresh: true, // Recalcule en cas de redimensionnement de l'écran
        }
      });

      // 2. Parallaxe sur les images à l'intérieur des cartes
      const images = imageRefs.current.filter(Boolean);
      images.forEach((img) => {
        gsap.to(img, {
          x: '5%', // Correspond à la largeur supplémentaire de 10% (left: -5%, width: 110%)
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${track.scrollWidth}`,
            scrub: 1,
          }
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="projects__pin-wrapper">
        
        <div className="projects__header">
          <div className="projects__eyebrow">{t('projects.eyebrow')}</div>
          <h2 className="projects__title">{t('projects.title_start')} <span className="highlight">{t('projects.title_highlight')}</span></h2>
        </div>

        <div className="projects__track" ref={trackRef}>
          {projectsData.map((project, index) => (
            <div className="project-card" key={project.id}>
              
              <div className="project-card__image-container">
                <img 
                  src={project.image} 
                  alt={t(project.titleKey)} 
                  className="project-card__image" 
                  ref={(el) => { imageRefs.current[index] = el; }}
                />
                
                <div className="project-card__overlay">
                  <div className="project-card__content">
                    <h3 className="project-card__title">{t(project.titleKey)}</h3>
                    <p className="project-card__description">{t(project.descKey)}</p>
                    
                    <div className="project-card__tags">
                      {project.tags.map(tag => (
                        <span key={tag} className="project-tag">{tag}</span>
                      ))}
                    </div>

                    <a href={project.link} className="project-card__btn" target="_blank" rel="noreferrer">
                      {t('projects.view_site')}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 8 }}>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>

              </div>
              
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
