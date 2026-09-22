"use client";

import { MotionConfig } from "motion/react";
import { CursorProvider } from "./CustomCursor";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <CursorProvider>{children}</CursorProvider>
    </MotionConfig>
  );
}
