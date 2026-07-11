"use client";

import { X } from "lucide-react";

import type { DifficultyFilter } from "./challenges-list-state";
import { ChallengesNavigationTree } from "./challenges-navigation-tree";
import {
  buildChallengeTopicSections,
  type ChallengeTopicFilter,
} from "./challenges-taxonomy";
import type { Challenge } from "./ema-challenge-card-helpers";

export function ChallengesNavigationDrawer({
  open,
  challenges,
  topicFilter,
  filterDifficulty,
  onClose,
  onTopicChange,
  onDifficultyChange,
}: {
  open: boolean;
  challenges: Challenge[];
  topicFilter: ChallengeTopicFilter;
  filterDifficulty: DifficultyFilter;
  onClose: () => void;
  onTopicChange: (topic: ChallengeTopicFilter) => void;
  onDifficultyChange: (difficulty: DifficultyFilter) => void;
}) {
  const sections = buildChallengeTopicSections(challenges);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Fechar navegação"
        className="challengers-overlay absolute inset-0"
        onClick={onClose}
      />
      <section className="challengers-panel absolute bottom-0 left-3 right-3 max-h-[82svh] overflow-auto rounded-t-[18px] border px-4 pb-5 pt-4">
        <header className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--challengers-muted)]">
            Navegação
          </p>
          <button
            type="button"
            className="challengers-icon-button inline-flex size-8 items-center justify-center rounded-[8px] border"
            aria-label="Fechar navegação"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </header>
        <ChallengesNavigationTree
          sections={sections}
          topicFilter={topicFilter}
          filterDifficulty={filterDifficulty}
          density="drawer"
          onTopicChange={(topic) => {
            onTopicChange(topic);
            onClose();
          }}
          onDifficultyChange={onDifficultyChange}
        />
      </section>
    </div>
  );
}
