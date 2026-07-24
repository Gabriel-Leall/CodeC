"use client";

import { Atom, ChevronRight } from "lucide-react";

import type { DifficultyFilter } from "./challenges-list-state";
import { ChallengesTreeGroup } from "./challenges-tree-group";
import type { NavigationTreeDensity } from "./challenges-navigation-types";
import { ChallengesTopicNode } from "./challenges-topic-node";
import type {
  ChallengeTopicFilter,
  ChallengeTopicSection,
} from "./challenges-taxonomy";

const TYPESCRIPT_MODULES = [
  "Type System",
  "Generics & Advanced Types",
  "Utility Types",
  "Narrowing & Inference",
  "Modules & Tooling",
  "Best Practices",
] as const;

export function ChallengesNavigationTree({
  sections,
  topicFilter,
  filterDifficulty,
  density,
  onTopicChange,
  onDifficultyChange,
}: {
  sections: ChallengeTopicSection[];
  topicFilter: ChallengeTopicFilter;
  filterDifficulty: DifficultyFilter;
  density: NavigationTreeDensity;
  onTopicChange: (topic: ChallengeTopicFilter) => void;
  onDifficultyChange: (difficulty: DifficultyFilter) => void;
}) {
  return (
    <nav className="mt-4 space-y-4" aria-label="Árvore de desafios">
      <ChallengesTreeGroup
        label="React"
        icon={<Atom className="size-4" />}
        expanded
        density={density}
      >
        {sections.map((section) => (
          <ChallengesTopicNode
            key={section.key}
            section={section}
            activeTopic={topicFilter}
            activeDifficulty={filterDifficulty}
            density={density}
            onTopicChange={onTopicChange}
            onDifficultyChange={onDifficultyChange}
          />
        ))}
      </ChallengesTreeGroup>

      <ChallengesTreeGroup
        label="TypeScript"
        icon={<span className="text-[0.62rem] font-bold">TS</span>}
        expanded={density === "drawer"}
        density={density}
        iconClassName="bg-[var(--challengers-blue)] text-[var(--challengers-surface)]"
      >
        {TYPESCRIPT_MODULES.map((module) => (
          <div
            key={module}
            className="flex items-center gap-2 py-1.5 pl-8 text-[0.78rem] text-[var(--challengers-ink)]"
          >
            <ChevronRight className="size-3 text-[var(--challengers-muted)]" />
            <span>{module}</span>
          </div>
        ))}
      </ChallengesTreeGroup>
    </nav>
  );
}
