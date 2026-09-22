"use client";

import { useRef } from "react";
import { motion, useSpring } from "motion/react";
import { useCursor } from "./CustomCursor";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  cursorType?: "pointer" | "project" | "default";
  cursorText?: string;
}

export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
  cursorType = "pointer",
  cursorText = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  const springConfig = { damping: 14, stiffness: 160, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (clientX - centerX) * strength;
    const distanceY = (clientY - centerY) * strength;
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseEnter = () => {
    setCursor(cursorType, cursorText);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    resetCursor();
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
