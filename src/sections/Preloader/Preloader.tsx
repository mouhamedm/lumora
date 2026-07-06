import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Bloquer le scroll du body
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Débloquer le scroll
          document.body.style.overflow = '';
          // Informer le parent que l'animation est finie
          onComplete();
        }
      });

      // Objet temporaire pour animer de 0 à 100
      const counterObj = { value: 0 };

      // 1. Faire apparaître le compteur
      tl.to('.preloader__counter-wrapper', { 
        opacity: 1, 
        duration: 0.5, 
        ease: 'power2.out' 
      });

      // 2. Animer le compteur et la barre de progression en même temps
      tl.to(counterObj, {
        value: 100,
        duration: 2.2,
        ease: 'power3.inOut',
        onUpdate: () => {
          setProgress(Math.round(counterObj.value));
        }
      }, '<');

      tl.to(barRef.current, {
        width: '100%',
        duration: 2.2,
        ease: 'power3.inOut'
      }, '<');

      // 3. Révéler le logo "MMD.DEV" un peu avant la fin du compteur (vers 70%)
      tl.to('.preloader__logo', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out',
      }, '-=0.8');

      // 4. Petite pause pour admirer le 100% et le logo
      tl.to({}, { duration: 0.4 });

      // 5. Faire monter le contenu textuel vers le haut avec un fondu
      tl.to('.preloader__content', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.in'
      });

      // 6. La transition épique : on "lève le rideau" avec un effet élastique courbé
      // FIX IPHONE BUG: Safari sur iOS bug complètement quand on anime un transform Y avec un border-radius sur un élément fixed.
      // La solution absolue est d'animer la `height` de 100% à 0. L'écran va se réduire vers le haut, en gardant la courbure, sans bugger !
      tl.to(containerRef.current, {
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 1.2,
        ease: 'power3.inOut',
        borderBottomRightRadius: '50% 10%', 
        borderBottomLeftRadius: '50% 10%',
      }, '-=0.4');

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div className="preloader" ref={containerRef}>
      <div className="preloader__content">
        <div className="preloader__logo">
          MMD<span className="preloader__logo-dot">.</span><span className="preloader__logo-dev">DEV</span>
        </div>
        
        <div className="preloader__counter-wrapper">
          <div className="preloader__counter" ref={counterRef}>
            {progress}
          </div>
          <div className="preloader__percent">%</div>
        </div>
      </div>
      
      <div className="preloader__bar-container">
        <div className="preloader__bar" ref={barRef}></div>
      </div>
    </div>
  );
};

export default Preloader;
