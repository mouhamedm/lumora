import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export interface TextRevealProps {
  text: string;
  type?: "words" | "chars";
  className?: string;
  spanClassName?: string;
  delay?: number;
  triggerRef?: React.RefObject<HTMLElement | null>;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  type = "words",
  className = "",
  spanClassName = "",
  delay = 0,
  triggerRef,
  as: Component = "span",
}) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const units = el.querySelectorAll<HTMLElement>(".reveal-unit");
    if (!units.length) return;

    const triggerEl = triggerRef?.current || el;
    let observer: IntersectionObserver | null = null;

    const ctx = gsap.context(() => {
      const tween = gsap.fromTo(
        units,
        {
          yPercent: 110,
          opacity: 0,
          rotateZ: type === "chars" ? 4 : 2,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration: type === "chars" ? 0.75 : 0.85,
          stagger: type === "chars" ? 0.022 : 0.038,
          delay,
          ease: "power3.out",
          clearProps: "transform,willChange",
          paused: true,
        },
      );

      if (typeof IntersectionObserver === "undefined") {
        tween.play();
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            tween.play();
            observer?.disconnect();
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0 },
      );
      observer.observe(triggerEl);
    }, el);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
  }, [text, type, delay, triggerRef]);

  const trimmed = text.trim();
  if (!trimmed) return null;

  const words = trimmed.split(/\s+/);

  const content =
    type === "chars"
      ? words.map((word, wordIdx) => {
          const isLast = wordIdx === words.length - 1;
          return (
            <span
              key={wordIdx}
              className={`inline-block whitespace-nowrap ${
                isLast ? "" : "mr-[0.25em]"
              }`}
            >
              {word.split("").map((char, charIdx) => (
                <span
                  key={charIdx}
                  className="inline-block overflow-hidden align-top"
                >
                  <span
                    className={`reveal-unit inline-block will-change-transform ${spanClassName}`}
                  >
                    {char}
                  </span>
                </span>
              ))}
            </span>
          );
        })
      : words.map((word, idx) => {
          const isLast = idx === words.length - 1;
          return (
            <span
              key={idx}
              className={`inline-block overflow-hidden align-top ${
                isLast ? "" : "mr-[0.25em]"
              }`}
            >
              <span
                className={`reveal-unit inline-block will-change-transform ${spanClassName}`}
              >
                {word}
              </span>
            </span>
          );
        });

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `inline-block max-w-full ${className}`,
    },
    content,
  );
};

export default TextReveal;
