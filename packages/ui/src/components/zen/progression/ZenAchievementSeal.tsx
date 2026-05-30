"use client";

import { HankoMarkSvg } from "@CC/ui/assets/zen/sumi-strokes";
import { cn } from "@CC/ui/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { sealImpact } from "../motion/presets";

type ZenAchievementSealProps = {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function ZenAchievementSeal({ title, description, className }: ZenAchievementSealProps) {
  return (
    <motion.div
      variants={sealImpact}
      initial="hidden"
      animate="visible"
      className={cn("zen-paper flex items-center gap-3 border border-[color:var(--zen-border)] p-3", className)}
      role="status"
    >
      <span className="grid size-12 rotate-[-5deg] place-items-center border border-[color:var(--zen-hanko)] text-[color:var(--zen-hanko)]">
        <HankoMarkSvg className="size-8" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[color:var(--zen-ink)]">{title}</span>
        {description ? <span className="block text-xs/relaxed text-[color:var(--zen-muted)]">{description}</span> : null}
      </span>
    </motion.div>
  );
}

