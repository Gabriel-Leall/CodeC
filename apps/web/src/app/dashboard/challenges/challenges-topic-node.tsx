"use client";

import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@kodan/ui/lib/utils";
import type { DifficultyFilter } from "./challenges-list-state";
import { ChallengesDifficultyNode } from "./challenges-difficulty-node";
import type {
  NavigationTreeDensity,
  TopicNavigationHandlers,
} from "./challenges-navigation-types";
import type {
  ChallengeTopicFilter,
  ChallengeTopicSection,
} from "./challenges-taxonomy";
import type { Difficulty } from "./ema-challenge-card-helpers";

const DIFFICULTIES: readonly Difficulty[] = ["EASY", "MEDIUM", "HARD"];

export function ChallengesTopicNode({
  section,
  activeTopic,
  activeDifficulty,
  density,
  onTopicChange,
  onDifficultyChange,
}: {
  section: ChallengeTopicSection;
  activeTopic: ChallengeTopicFilter;
  activeDifficulty: DifficultyFilter;
  density: NavigationTreeDensity;
} & TopicNavigationHandlers) {
  const expanded = activeTopic === section.key;

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[8px] px-2.5 text-left text-[0.78rem] transition-colors",
          density === "desktop" ? "py-2" : "py-1.5",
          expanded
            ? "challengers-tree-selected"
            : "text-[var(--challengers-ink)] hover:bg-[var(--challengers-panel)]",
        )}
        onClick={() => {
          onTopicChange(section.key);
          onDifficultyChange("ALL");
        }}
      >
        <span className="flex min-w-0 items-center gap-2">
          {expanded ? (
            <ChevronDown className="size-3.5 shrink-0" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0" />
          )}
          <span className="truncate">{section.label}</span>
        </span>
        <span className="text-[0.72rem] text-[var(--challengers-muted)]">
          {section.count}
        </span>
      </button>

      {expanded ? (
        <div className="ml-6 mt-1 border-l border-dotted border-[color:var(--challengers-border-strong)] py-1 pl-4">
          {DIFFICULTIES.map((difficulty) => (
            <ChallengesDifficultyNode
              key={difficulty}
              difficulty={difficulty}
              count={section.difficulties[difficulty]}
              active={activeDifficulty === difficulty}
              onClick={() => onDifficultyChange(difficulty)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
