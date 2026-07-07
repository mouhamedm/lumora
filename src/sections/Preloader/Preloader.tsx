import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Preloader.css';

interface PreloaderProps {
  onStart: () => void;
  onComplete: () => void;
}

const Preloader = ({ onStart, onComplete }: PreloaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          onComplete();
        }
      });

      tl.to(logoWrapRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      });

      tl.to('.preloader__bar-wrapper', {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      }, '-=0.15');

      tl.to(barRef.current, {
        width: '100%',
        duration: 0.55,
        ease: 'power2.inOut',
      }, '-=0.1');

      tl.to(logoWrapRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      }, '+=0.1');

      tl.to('.preloader__bar-wrapper', {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      }, '<');

      tl.to(panelLeftRef.current, {
        xPercent: -100,
        duration: 0.6,
        ease: 'power3.inOut',
        onStart: () => {
          onStart();
        }
      }, '-=0.05');

      tl.to(panelRightRef.current, {
        xPercent: 100,
        duration: 0.6,
        ease: 'power3.inOut',
      }, '<');

    }, containerRef);

    return () => ctx.revert();
  }, [onStart, onComplete]);

  return (
    <div className="preloader" ref={containerRef}>
      <div className="preloader__panel preloader__panel--left" ref={panelLeftRef} />
      <div className="preloader__panel preloader__panel--right" ref={panelRightRef} />

      <div className="preloader__content">
        <div className="preloader__logo" ref={logoWrapRef}>
          <span className="preloader__logo-text">MMD</span>
          <span className="preloader__logo-dot">.</span>
          <span className="preloader__logo-dev">DEV</span>
        </div>

        <div className="preloader__bar-wrapper">
          <div className="preloader__bar-track">
            <div className="preloader__bar" ref={barRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;