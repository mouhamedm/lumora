import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';

function PulsatingDots({ dotClassName = '' }: { dotClassName?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex space-x-2">
        <motion.div
          className={`h-3 w-3 rounded-full ${dotClassName}`}
          style={{ backgroundColor: 'var(--accent, #4c8dff)' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
        <motion.div
          className={`h-3 w-3 rounded-full ${dotClassName}`}
          style={{ backgroundColor: 'var(--accent, #4c8dff)' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 0.3,
          }}
        />
        <motion.div
          className={`h-3 w-3 rounded-full ${dotClassName}`}
          style={{ backgroundColor: 'var(--accent, #4c8dff)' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: 0.6,
          }}
        />
      </div>
    </div>
  );
}

interface PreloaderProps {
  onStart: () => void;
  onComplete: () => void;
}

export default function Preloader({ onStart, onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const loaderWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });

      tl.to(logoWrapRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      });

      tl.to(loaderWrapRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, '-=0.15');

      // Let the pulsating dots animation run smoothly
      tl.to({}, {
        duration: 1.2,
      });

      tl.to([logoWrapRef.current, loaderWrapRef.current], {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });

      tl.call(() => {
        document.body.style.overflow = '';
      }, [], '-=0.05');

      tl.to(panelLeftRef.current, {
        xPercent: -100,
        duration: 0.6,
        ease: 'power3.inOut',
        onStart: () => {
          onStart();
          if (containerRef.current) {
            containerRef.current.style.pointerEvents = 'none';
          }
        }
      });

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

        <div className="preloader__dots-wrapper" ref={loaderWrapRef}>
          <PulsatingDots dotClassName="shadow-[0_0_12px_rgba(76,141,255,0.7)]" />
        </div>
      </div>
    </div>
  );
}