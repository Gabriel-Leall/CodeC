import type { ReactNode } from "react";

import { buildChallengeRows, matchesChallenge, type DifficultyFilter } from "./challenges-list-state";
import { type Challenge } from "./ema-challenge-card-helpers";
import { EmaChallengeCard } from "./ema-challenge-card";

export function ChallengesTree({
  challenges,
  searchQuery,
  filterDifficulty,
  activeCardId,
  setActiveCardId,
  userElo,
}: {
  challenges: Challenge[];
  searchQuery: string;
  filterDifficulty: DifficultyFilter;
  activeCardId: string | null;
  setActiveCardId: (id: string | null) => void;
  userElo: number;
}) {
  const rows = buildChallengeRows(challenges);

  return (
    <div className="relative mx-auto flex w-full max-w-[860px] flex-col">
      {rows.map((row, rowIndex) => {
        const rowId = `row-${rowIndex}`;

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
              setActiveCardId={setActiveCardId}
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
            setActiveCardId={setActiveCardId}
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
  setActiveCardId,
  userElo,
}: {
  leftChallenge: Challenge;
  rightChallenge: Challenge;
  leftMatched: boolean;
  rightMatched: boolean;
  leftIsActive: boolean;
  rightIsActive: boolean;
  setActiveCardId: (id: string | null) => void;
  userElo: number;
}) {
  return (
    <div className="relative flex min-h-[180px] w-full flex-col items-center justify-center py-4 md:block md:h-[180px] md:py-0">
      <svg
        aria-hidden="true"
        className="absolute inset-0 hidden size-full overflow-visible md:block"
        viewBox="0 0 768 180"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M 384 0 C 300 12, 214 22, 214 56 C 214 110, 300 150, 384 180"
          className={`fill-none stroke-2 transition-all duration-500 ${
            leftMatched ? "stroke-primary/45" : "stroke-border/20"
          }`}
        />
        <line
          x1="214"
          y1="56"
          x2="214"
          y2="70"
          className={`stroke-2 transition-all duration-500 ${
            leftMatched ? "stroke-border/75" : "stroke-border/20"
          }`}
        />
        <path
          d="M 384 0 C 468 12, 554 22, 554 56 C 554 110, 468 150, 384 180"
          className={`fill-none stroke-2 transition-all duration-500 ${
            rightMatched ? "stroke-primary/45" : "stroke-border/20"
          }`}
        />
        <line
          x1="554"
          y1="56"
          x2="554"
          y2="70"
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
            setActiveCardId={setActiveCardId}
            userElo={userElo}
          />
        </CardPosition>

        <CardPosition left={false}>
          <EmaChallengeCard
            challenge={rightChallenge}
            matched={rightMatched}
            isActive={rightIsActive}
            setActiveCardId={setActiveCardId}
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
  setActiveCardId,
  userElo,
}: {
  challenge: Challenge;
  matched: boolean;
  isActive: boolean;
  isLeft: boolean;
  setActiveCardId: (id: string | null) => void;
  userElo: number;
}) {
  return (
    <div className="relative flex min-h-[180px] w-full flex-col items-center justify-center py-4 md:block md:h-[180px] md:py-0">
      <svg
        aria-hidden="true"
        className="absolute inset-0 hidden size-full overflow-visible md:block"
        viewBox="0 0 768 180"
        preserveAspectRatio="none"
        fill="none"
      >
        <path d="M 384 0 C 390 46, 378 134, 384 180" className="fill-none stroke-2 stroke-border/80" />
        <path
          d={isLeft ? "M 384 44 C 300 44, 214 48, 214 56" : "M 384 44 C 468 44, 554 48, 554 56"}
          className={`fill-none stroke-2 transition-all duration-500 ${
            matched ? "stroke-primary/45" : "stroke-border/20"
          }`}
        />
        <line
          x1={isLeft ? "214" : "554"}
          y1="56"
          x2={isLeft ? "214" : "554"}
          y2="70"
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
            setActiveCardId={setActiveCardId}
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
        left ? "md:left-[84px]" : "md:left-[424px]"
      }`}
    >
      <div className="absolute left-[-24px] top-1/2 h-0.5 w-6 -translate-y-1/2 bg-border/40 md:hidden" />
      {children}
    </div>
  );
}
