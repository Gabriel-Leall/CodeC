"use client";

import { cn } from "@kodan/ui/lib/utils";
import { motion } from "framer-motion";
import { zenEase } from "../motion/presets";

type DanProgressProps = {
  value: number;
  label?: string;
  className?: string;
};

export function DanProgress({ value, label = "Dan progress", className }: DanProgressProps) {
  const progress = Math.max(0, Math.min(value, 100));

  return (
    <div className={cn("space-y-2 text-[color:var(--zen-ink)]", className)}>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-semibold">{label}</span>
        <span className="text-[color:var(--zen-muted)]">{progress}%</span>
      </div>
      <progress className="sr-only" value={progress} max={100} aria-label={label} />
      <div className="h-2 overflow-hidden bg-[color:color-mix(in_oklch,var(--zen-ink)_10%,transparent)]" aria-hidden="true">
        <motion.div
          className="h-full bg-[color:var(--zen-hanko)]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: zenEase }}
        />
      </div>
    </div>
  );
}
