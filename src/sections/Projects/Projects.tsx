import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';
import idconsultImg from '../../assets/images/idconsult.webp';
import immoAppartImg from '../../assets/images/immo-appart.webp';
import prestigeDiningImg from '../../assets/images/prestige-dining.webp';
import mokaNoirImg from '../../assets/images/moka-noir.webp';
import empiregymImg from '../../assets/images/empiregym.webp';

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


  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    let ctx = gsap.context(() => {
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        return -(trackWidth - window.innerWidth + 96); 
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
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
          {projectsData.map((project) => (
            <div className="project-card" key={project.id}>
              
              <div className="project-card__image-container">
                <img 
                  src={project.image} 
                  alt={t(project.titleKey)} 
                  className="project-card__image" 
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
