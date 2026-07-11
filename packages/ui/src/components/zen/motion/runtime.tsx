"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

function ZenMotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export { ZenMotionProvider };
