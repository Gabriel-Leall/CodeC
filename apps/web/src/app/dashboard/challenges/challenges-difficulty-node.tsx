"use client";

import { cn } from "@kodan/ui/lib/utils";
import type { Difficulty } from "./ema-challenge-card-helpers";
import { getDifficultyNavigationLabel } from "./ema-challenge-card-helpers";

export function ChallengesDifficultyNode({
  difficulty,
  count,
  active,
  onClick,
}: {
  difficulty: Difficulty;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-[6px] px-2 py-1.5 text-left text-[0.76rem] transition-colors",
        active
          ? "bg-[var(--challengers-panel-strong)] text-[var(--challengers-ink)]"
          : "text-[var(--challengers-muted)] hover:bg-[var(--challengers-panel)] hover:text-[var(--challengers-ink)]",
      )}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "size-1.5 rounded-full",
            difficulty === "EASY" && "challengers-dot-easy",
            difficulty === "MEDIUM" && "challengers-dot-medium",
            difficulty === "HARD" && "challengers-dot-hard",
          )}
        />
        <span>{getDifficultyNavigationLabel(difficulty)}</span>
      </span>
      <span>({count})</span>
    </button>
  );
}
