import type { Variants } from "framer-motion";

export const zenEase = [0.22, 1, 0.36, 1] as const;

export const zenFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: zenEase },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.22, ease: zenEase },
  },
};

export const brushReveal: Variants = {
  hidden: { opacity: 0, scaleX: 0, transformOrigin: "left" },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.42, ease: zenEase },
  },
};

export const sealImpact: Variants = {
  hidden: { opacity: 0, scale: 0.92, rotate: -4 },
  visible: {
    opacity: 1,
    scale: [0.92, 1.04, 1],
    rotate: -2,
    transition: { duration: 0.34, ease: "easeOut" },
  },
};

export const calmFloat = {
  y: -1,
  transition: { duration: 0.18, ease: "easeOut" },
} as const;

export const inkSpread: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.48, ease: zenEase },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(2px)",
    transition: { duration: 0.24, ease: zenEase },
  },
};

export const paperSlide: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.24, ease: zenEase },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    transition: { duration: 0.2, ease: zenEase },
  },
};
