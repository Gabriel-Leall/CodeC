"use client";

import {
  Atom,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@kodan/ui/lib/utils";
import type { DifficultyFilter } from "./challenges-list-state";
import {
  buildChallengeTopicSections,
  type ChallengeTopicFilter,
  type ChallengeTopicKey,
  type ChallengeTopicSection,
} from "./challenges-taxonomy";
import type { Challenge, Difficulty } from "./ema-challenge-card-helpers";
import { getDifficultyNavigationLabel } from "./ema-challenge-card-helpers";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

const TYPESCRIPT_MODULES = [
  "Type System",
  "Generics & Advanced Types",
  "Utility Types",
  "Narrowing & Inference",
  "Modules & Tooling",
  "Best Practices",
] as const;

type NavigationTreeDensity = "desktop" | "drawer";

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
      <TreeGroup
        label="React"
        icon={<Atom className="size-4" />}
        expanded
        density={density}
      >
        {sections.map((section) => (
          <TopicNode
            key={section.key}
            section={section}
            activeTopic={topicFilter}
            activeDifficulty={filterDifficulty}
            density={density}
            onTopicChange={onTopicChange}
            onDifficultyChange={onDifficultyChange}
          />
        ))}
      </TreeGroup>

      <TreeGroup
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
      </TreeGroup>
    </nav>
  );
}

function TopicNode({
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
  onTopicChange: (topic: ChallengeTopicKey) => void;
  onDifficultyChange: (difficulty: DifficultyFilter) => void;
}) {
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
            <DifficultyNode
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

function DifficultyNode({
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

function TreeGroup({
  label,
  icon,
  expanded,
  density,
  iconClassName,
  children,
}: {
  label: string;
  icon: ReactNode;
  expanded: boolean;
  density: NavigationTreeDensity;
  iconClassName?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between rounded-[8px] px-2.5",
          density === "desktop" ? "py-2.5" : "py-2",
          expanded
            ? "bg-[var(--challengers-panel-strong)]"
            : "bg-transparent",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "inline-flex size-6 shrink-0 items-center justify-center rounded-[5px] border border-[color:var(--challengers-blue-border)] bg-[var(--challengers-blue-soft)] text-[var(--challengers-blue)]",
              iconClassName,
            )}
          >
            {icon}
          </span>
          <span className="truncate text-[0.85rem] font-medium text-[var(--challengers-ink)]">
            {label}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="size-3.5 text-[var(--challengers-muted)]" />
        ) : (
          <ChevronRight className="size-3.5 text-[var(--challengers-muted)]" />
        )}
      </div>
      {expanded ? <div className="mt-2 space-y-1">{children}</div> : null}
    </div>
  );
}
