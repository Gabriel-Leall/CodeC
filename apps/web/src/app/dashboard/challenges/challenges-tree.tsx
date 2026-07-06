import type { ReactNode } from "react";

import { buildChallengeRows, matchesChallenge, type DifficultyFilter } from "./challenges-list-state";
import { type Challenge } from "./ema-challenge-card-helpers";
import { EmaChallengeCard } from "./ema-challenge-card";

export function ChallengesTree({
  challenges,
  searchQuery,
  filterDifficulty,
  activeCardId,
  setFocusedCardId,
  userElo,
}: {
  challenges: Challenge[];
  searchQuery: string;
  filterDifficulty: DifficultyFilter;
  activeCardId: string | null;
  setFocusedCardId: (id: string | null) => void;
  userElo: number;
}) {
  const rows = buildChallengeRows(challenges);
  const numberedRows = rows.map((row, rowIndex) => {
    const startNumber =
      rows.slice(0, rowIndex).reduce((count, currentRow) => count + currentRow.items.length, 0) + 1;

    return {
      row,
      rowId: `row-${rowIndex}`,
      nodeNumbers: row.items.map((_, itemIndex) => startNumber + itemIndex),
    };
  });

  return (
    <div className="relative mx-auto flex w-full max-w-[940px] flex-col">
      <div className="absolute bottom-10 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--zen-ink)_16%,transparent),color-mix(in_oklch,var(--zen-ink)_4%,transparent)_18%,color-mix(in_oklch,var(--zen-ink)_12%,transparent)_82%,transparent)] md:block" />
      <div className="absolute left-1/2 top-0 hidden size-3 -translate-x-1/2 rounded-full border border-[color:var(--zen-border)] bg-[color:var(--zen-washi)] dark:border-border/80 dark:bg-background md:block" />
      {numberedRows.map(({ row, rowId, nodeNumbers }, rowIndex) => {
        if (row.type === "pair") {
          const [leftChallenge, rightChallenge] = row.items;
          const leftMatched = matchesChallenge(leftChallenge, searchQuery, filterDifficulty);
          const rightMatched = matchesChallenge(rightChallenge, searchQuery, filterDifficulty);

          return (
            <PairChallengeRow
              key={rowId}
              leftChallenge={leftChallenge}
              rightChallenge={rightChallenge}
              leftMatched={leftMatched}
              rightMatched={rightMatched}
              leftIsActive={activeCardId === leftChallenge.id}
              rightIsActive={activeCardId === rightChallenge.id}
              leftNodeNumber={nodeNumbers[0]!}
              rightNodeNumber={nodeNumbers[1]!}
              setFocusedCardId={setFocusedCardId}
              userElo={userElo}
            />
          );
        }

        const challenge = row.items[0];
        const matched = matchesChallenge(challenge, searchQuery, filterDifficulty);

        return (
          <SingleChallengeRow
            key={rowId}
            challenge={challenge}
            matched={matched}
            isActive={activeCardId === challenge.id}
            isLeft={rowIndex % 2 === 0}
            nodeNumber={nodeNumbers[0]!}
            setFocusedCardId={setFocusedCardId}
            userElo={userElo}
          />
        );
      })}
    </div>
  );
}

function PairChallengeRow({
  leftChallenge,
  rightChallenge,
  leftMatched,
  rightMatched,
  leftIsActive,
  rightIsActive,
  leftNodeNumber,
  rightNodeNumber,
  setFocusedCardId,
  userElo,
}: {
  leftChallenge: Challenge;
  rightChallenge: Challenge;
  leftMatched: boolean;
  rightMatched: boolean;
  leftIsActive: boolean;
  rightIsActive: boolean;
  leftNodeNumber: number;
  rightNodeNumber: number;
  setFocusedCardId: (id: string | null) => void;
  userElo: number;
}) {
  return (
    <div className="relative flex min-h-[228px] w-full flex-col items-center justify-center py-5 md:block md:h-[228px] md:py-0">
      <svg
        aria-hidden="true"
        className="absolute inset-0 hidden size-full overflow-visible md:block"
        viewBox="0 0 940 228"
        preserveAspectRatio="none"
        fill="none"
      >
        <circle
          cx="470"
          cy="62"
          r="5.5"
          className="fill-[color:var(--zen-washi)] stroke-[color:var(--zen-border)] dark:fill-background dark:stroke-border/80"
        />
        <path
          d="M 470 62 C 430 66, 374 80, 308 114"
          className={`fill-none stroke-2 transition-all duration-500 ${
            leftMatched ? "stroke-primary/45" : "stroke-border/20"
          }`}
        />
        <path
          d="M 470 62 C 510 66, 566 80, 632 114"
          className={`fill-none stroke-2 transition-all duration-500 ${
            rightMatched ? "stroke-primary/45" : "stroke-border/20"
          }`}
        />
        <line
          x1="308"
          y1="114"
          x2="308"
          y2="124"
          className={`stroke-2 transition-all duration-500 ${
            leftMatched ? "stroke-border/75" : "stroke-border/20"
          }`}
        />
        <line
          x1="632"
          y1="114"
          x2="632"
          y2="124"
          className={`stroke-2 transition-all duration-500 ${
            rightMatched ? "stroke-border/75" : "stroke-border/20"
          }`}
        />
      </svg>

      <MobileVine />

      <div className="relative z-10 flex h-full w-full max-w-3xl flex-col items-start gap-6 px-4 md:block md:items-center md:gap-0 md:px-0">
        <CardPosition left>
          <EmaChallengeCard
            challenge={leftChallenge}
            matched={leftMatched}
            isActive={leftIsActive}
            nodeNumber={leftNodeNumber}
            setFocusedCardId={setFocusedCardId}
            userElo={userElo}
          />
        </CardPosition>

        <CardPosition left={false}>
          <EmaChallengeCard
            challenge={rightChallenge}
            matched={rightMatched}
            isActive={rightIsActive}
            nodeNumber={rightNodeNumber}
            setFocusedCardId={setFocusedCardId}
            userElo={userElo}
          />
        </CardPosition>
      </div>
    </div>
  );
}

function SingleChallengeRow({
  challenge,
  matched,
  isActive,
  isLeft,
  nodeNumber,
  setFocusedCardId,
  userElo,
}: {
  challenge: Challenge;
  matched: boolean;
  isActive: boolean;
  isLeft: boolean;
  nodeNumber: number;
  setFocusedCardId: (id: string | null) => void;
  userElo: number;
}) {
  return (
    <div className="relative flex min-h-[228px] w-full flex-col items-center justify-center py-5 md:block md:h-[228px] md:py-0">
      <svg
        aria-hidden="true"
        className="absolute inset-0 hidden size-full overflow-visible md:block"
        viewBox="0 0 940 228"
        preserveAspectRatio="none"
        fill="none"
      >
        <circle
          cx="470"
          cy="62"
          r="5.5"
          className="fill-[color:var(--zen-washi)] stroke-[color:var(--zen-border)] dark:fill-background dark:stroke-border/80"
        />
        <path
          d={isLeft ? "M 470 62 C 426 68, 370 82, 308 114" : "M 470 62 C 514 68, 570 82, 632 114"}
          className={`fill-none stroke-2 transition-all duration-500 ${
            matched ? "stroke-primary/45" : "stroke-border/20"
          }`}
        />
        <line
          x1={isLeft ? "308" : "632"}
          y1="114"
          x2={isLeft ? "308" : "632"}
          y2="124"
          className={`stroke-2 transition-all duration-500 ${
            matched ? "stroke-border/75" : "stroke-border/20"
          }`}
        />
      </svg>

      <MobileVine />

      <div className="relative z-10 flex h-full w-full max-w-3xl flex-col items-start px-4 md:block md:items-center md:px-0">
        <CardPosition left={isLeft}>
          <EmaChallengeCard
            challenge={challenge}
            matched={matched}
            isActive={isActive}
            nodeNumber={nodeNumber}
            setFocusedCardId={setFocusedCardId}
            userElo={userElo}
          />
        </CardPosition>
      </div>
    </div>
  );
}

function MobileVine() {
  return (
    <div className="pointer-events-none absolute bottom-0 left-6 top-0 z-0 w-8 -translate-x-1/2 md:hidden">
      <svg aria-hidden="true" className="size-full overflow-visible" viewBox="0 0 32 100" preserveAspectRatio="none" fill="none">
        <line x1="16" y1="0" x2="16" y2="100" className="stroke-2 stroke-border/80" />
      </svg>
    </div>
  );
}

function CardPosition({
  children,
  left,
}: {
  children: ReactNode;
  left: boolean;
}) {
  return (
    <div
      className={`ml-12 md:ml-0 md:absolute md:top-1/2 md:-translate-y-1/2 ${
        left ? "md:left-[68px]" : "md:left-[584px]"
      }`}
    >
      <div className="absolute left-[-24px] top-1/2 h-0.5 w-6 -translate-y-1/2 bg-border/40 md:hidden" />
      {children}
    </div>
  );
}
