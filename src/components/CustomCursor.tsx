"use client";

import { useEffect, useState, createContext, useContext, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

function subscribeFinePointer(callback: () => void) {
  const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getFinePointerSnapshot() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function getServerSnapshot() {
  return false;
}

type CursorType = "default" | "pointer" | "project" | "text" | "hidden";

interface CursorContextType {
  cursorType: CursorType;
  cursorText: string;
  setCursor: (type: CursorType, text?: string) => void;
  resetCursor: () => void;
}

const CursorContext = createContext<CursorContextType>({
  cursorType: "default",
  cursorText: "",
  setCursor: () => {},
  resetCursor: () => {},
});

export const useCursor = () => useContext(CursorContext);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [cursorText, setCursorText] = useState("");

  const setCursor = (type: CursorType, text = "") => {
    setCursorType(type);
    setCursorText(text);
  };

  const resetCursor = () => {
    setCursorType("default");
    setCursorText("");
  };

  return (
    <CursorContext.Provider value={{ cursorType, cursorText, setCursor, resetCursor }}>
      {children}
      <CustomCursor cursorType={cursorType} cursorText={cursorText} />
    </CursorContext.Provider>
  );
}

function CustomCursor({
  cursorType,
  cursorText,
}: {
  cursorType: CursorType;
  cursorText: string;
}) {
  const isFinePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getServerSnapshot
  );
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for high-end organic feel
  const springConfig = { damping: 24, stiffness: 280, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Fast spring for inner dot
  const dotConfig = { damping: 30, stiffness: 550 };
  const dotX = useSpring(mouseX, dotConfig);
  const dotY = useSpring(mouseY, dotConfig);

  useEffect(() => {
    if (!isFinePointer) return;

    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isFinePointer, mouseX, mouseY]);

  if (!isFinePointer) return null;

  const isProject = cursorType === "project";
  const isPointer = cursorType === "pointer";
  const isHidden = cursorType === "hidden" || !isVisible;

  return (
    <>
      {/* Outer Follower Ring / Pill */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-9999 flex items-center justify-center rounded-full will-change-transform"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHidden ? 0 : isProject ? 90 : isPointer ? 54 : 36,
          height: isHidden ? 0 : isProject ? 90 : isPointer ? 54 : 36,
          opacity: isHidden ? 0 : 1,
          backgroundColor: isProject
            ? "#FF3B1D"
            : isPointer
            ? "rgba(255, 59, 29, 0.12)"
            : "rgba(17, 17, 16, 0.04)",
          borderColor: isProject
            ? "#FF3B1D"
            : isPointer
            ? "#FF3B1D"
            : "rgba(17, 17, 16, 0.28)",
          borderWidth: isProject ? "0px" : "1.5px",
          scale: isHidden ? 0 : 1,
        }}
        transition={{
          type: "spring",
          damping: 22,
          stiffness: 300,
        }}
      >
        {isProject && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-[11px] font-black tracking-widest text-white uppercase select-none"
          >
            {cursorText || "VIEW"}
          </motion.span>
        )}
      </motion.div>

      {/* Center Core Dot */}
      {!isProject && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-10000 rounded-full will-change-transform"
          style={{
            x: dotX,
            y: dotY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            width: isHidden ? 0 : isPointer ? 8 : 5,
            height: isHidden ? 0 : isPointer ? 8 : 5,
            opacity: isHidden ? 0 : 1,
            backgroundColor: isPointer ? "#FF3B1D" : "#111110",
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 500,
          }}
        />
      )}
    </>
  );
}
