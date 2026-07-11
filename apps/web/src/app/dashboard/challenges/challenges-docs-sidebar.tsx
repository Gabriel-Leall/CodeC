"use client";

import type { DifficultyFilter } from "./challenges-list-state";
import { ChallengesNavigationTree } from "./challenges-navigation-tree";
import {
  buildChallengeTopicSections,
  type ChallengeTopicFilter,
} from "./challenges-taxonomy";
import type { Challenge } from "./ema-challenge-card-helpers";

export function ChallengesDocsSidebar({
  challenges,
  topicFilter,
  filterDifficulty,
  onTopicChange,
  onDifficultyChange,
}: {
  challenges: Challenge[];
  topicFilter: ChallengeTopicFilter;
  filterDifficulty: DifficultyFilter;
  onTopicChange: (topic: ChallengeTopicFilter) => void;
  onDifficultyChange: (difficulty: DifficultyFilter) => void;
}) {
  const sections = buildChallengeTopicSections(challenges);

  return (
    <aside className="h-full border-r border-[color:var(--challengers-border)] px-5 py-6">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--challengers-blue)]">
        Tecnologia
      </p>
      <ChallengesNavigationTree
        sections={sections}
        topicFilter={topicFilter}
        filterDifficulty={filterDifficulty}
        density="desktop"
        onTopicChange={onTopicChange}
        onDifficultyChange={onDifficultyChange}
      />
    </aside>
  );
}
