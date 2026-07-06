import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          onComplete();
        }
      });

      const counterObj = { value: 0 };

      tl.to('.preloader__counter-wrapper', { 
        opacity: 1, 
        duration: 0.5, 
        ease: 'power2.out' 
      });

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

      tl.to('.preloader__logo', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power4.out',
      }, '-=0.8');

      tl.to({}, { duration: 0.4 });

      tl.to('.preloader__content', {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.in'
      });
      
      tl.to(containerRef.current, {
        y: -(window.innerHeight * 1.5),
        duration: 1.2, 
        ease: 'power4.inOut', 
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
