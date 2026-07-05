"use client";

import { cn } from "@kodan/ui/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { zenFade } from "../motion/presets";

type ZenPaperProps = Omit<HTMLMotionProps<"section">, "children"> & {
  children: ReactNode;
  tone?: "washi" | "ink";
  padding?: "none" | "sm" | "md" | "lg";
  animated?: boolean;
};

const paddingClass = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6 md:p-8",
};

export function ZenPaper({
  className,
  children,
  tone = "washi",
  padding = "md",
  animated = true,
  ...props
}: ZenPaperProps) {
  return (
    <motion.section
      variants={animated ? zenFade : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
      exit={animated ? "exit" : undefined}
      className={cn(
        "zen-ink-edge relative overflow-hidden border text-sm/relaxed",
        paddingClass[padding],
        tone === "washi"
          ? "zen-paper border-[color:var(--zen-border)] text-[color:var(--zen-ink)]"
          : "border-[color:color-mix(in_oklch,var(--zen-washi)_24%,transparent)] bg-[color:var(--zen-ink)] text-[color:var(--zen-washi)]",
        className,
      )}
      {...props}
    >
      {children}
    </motion.section>
  );
}
