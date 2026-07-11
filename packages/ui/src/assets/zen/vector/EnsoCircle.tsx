"use client";

import type { SVGMotionProps } from "framer-motion";
import { ZenMotionProvider } from "@kodan/ui/components/zen/motion/runtime";
import { m } from "@kodan/ui/components/zen/motion/primitives";

type EnsoCircleProps = Omit<SVGMotionProps<SVGSVGElement>, "children"> & {
  title?: string;
  duration?: number;
};

export function EnsoCircle({ className, title, duration = 1.15, ...props }: EnsoCircleProps) {
  const titleId = title ? "zen-enso-circle-title" : undefined;

  return (
    <ZenMotionProvider>
      <m.svg
        viewBox="0 0 120 120"
        fill="none"
        role={title ? "img" : "presentation"}
        aria-hidden={title ? undefined : true}
        aria-labelledby={titleId}
        className={className}
        {...props}
      >
        {title ? <title id={titleId}>{title}</title> : null}
        <m.path
          d="M93.2 29.8C80.7 17.8 59.8 14.2 42.5 21.5C22.3 30.1 13.2 52.1 19.8 70.9C27.7 93.5 54.1 105.1 76.9 96.2C95.3 89 106.1 69.1 101.1 51.1C99.6 45.7 96.9 40.9 93.4 37.1"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          initial={{ strokeDashoffset: 1, opacity: 0.72 }}
          animate={{ strokeDashoffset: 0, opacity: 1 }}
          exit={{ strokeDashoffset: 1, opacity: 0 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        />
        <m.path
          d="M93.9 37.1C96.2 40.2 98.1 43.8 99.3 47.8"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeDasharray="1"
          initial={{ strokeDashoffset: 1, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 0.74 }}
          exit={{ strokeDashoffset: 1, opacity: 0 }}
          transition={{ duration: duration * 0.24, delay: duration * 0.82, ease: "easeOut" }}
        />
        <m.path
          d="M98.7 47.5C100.6 50.8 101.6 54.4 101.8 58.1"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeDasharray="1"
          initial={{ strokeDashoffset: 1, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 0.5 }}
          exit={{ strokeDashoffset: 1, opacity: 0 }}
          transition={{ duration: duration * 0.18, delay: duration * 0.92, ease: "easeOut" }}
        />
        <m.path
          d="M91.2 28.4C94.1 29.1 97.2 30.6 100.1 33.1"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="2.7"
          strokeLinecap="round"
          strokeDasharray="1"
          initial={{ strokeDashoffset: 1, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 0.46 }}
          exit={{ strokeDashoffset: 1, opacity: 0 }}
          transition={{ duration: duration * 0.18, delay: duration * 1.02, ease: "easeOut" }}
        />
        <m.path
          d="M98.7 33.6C101.3 35.3 103.1 37.4 104.2 39.8"
          pathLength={1}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="1"
          initial={{ strokeDashoffset: 1, opacity: 0 }}
          animate={{ strokeDashoffset: 0, opacity: 0.34 }}
          exit={{ strokeDashoffset: 1, opacity: 0 }}
          transition={{ duration: duration * 0.14, delay: duration * 1.1, ease: "easeOut" }}
        />
      </m.svg>
    </ZenMotionProvider>
  );
}
