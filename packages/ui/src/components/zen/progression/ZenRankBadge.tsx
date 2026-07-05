"use client";

import { ZenEnsoSvg } from "@kodan/ui/assets/zen/enso";
import { cn } from "@kodan/ui/lib/utils";
import { motion } from "framer-motion";
import { zenEase } from "../motion/presets";
import type { ZenRank } from "../zen-types";

type ZenRankBadgeProps = {
  rank: ZenRank;
  className?: string;
};

export function ZenRankBadge({ rank, className }: ZenRankBadgeProps) {
  const progress = Math.max(0, Math.min(rank.progress ?? 0, 100));

  return (
    <div
      className={cn(
        "zen-washi relative grid min-w-36 grid-cols-[auto_1fr] items-center gap-3 border border-[color:var(--zen-border)] px-3 py-2 text-[color:var(--zen-ink)]",
        className,
      )}
      aria-label={`${rank.label}, ${rank.kind.toUpperCase()} ${rank.level}, progresso ${progress}%`}
    >
      <ZenEnsoSvg className="size-10 text-[color:var(--zen-ink)] opacity-80" />
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-semibold">{rank.label}</span>
          <span className="text-[10px] uppercase text-[color:var(--zen-muted)]">
            {rank.kind} {rank.level}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden bg-[color:color-mix(in_oklch,var(--zen-ink)_10%,transparent)]">
          <motion.div
            className="h-full bg-[color:var(--zen-hanko)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7, ease: zenEase }}
          />
        </div>
      </div>
    </div>
  );
}
