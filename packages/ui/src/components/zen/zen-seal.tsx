"use client";

import { HankoMarkSvg } from "@kodan/ui/assets/zen/sumi-strokes";
import { cn } from "@kodan/ui/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { sealImpact } from "./motion/presets";

type ZenSealProps = HTMLMotionProps<"span"> & {
  label?: string;
};

export function ZenSeal({ className, label = "Zen", ...props }: ZenSealProps) {
  return (
    <motion.span
      variants={sealImpact}
      initial="hidden"
      animate="visible"
      className={cn(
        "inline-flex items-center gap-1.5 border border-[color:var(--zen-hanko)] px-2 py-1 text-[10px] font-semibold uppercase text-[color:var(--zen-hanko)]",
        className,
      )}
      aria-label={`Selo ${label}`}
      {...props}
    >
      <HankoMarkSvg className="size-4" />
      {label}
    </motion.span>
  );
}
