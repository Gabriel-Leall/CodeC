import type { Challenge } from "./ema-challenge-card-helpers";
import { DEFAULT_USER_ELO } from "./constants";

export type DifficultyFilter = "ALL" | "EASY" | "MEDIUM" | "HARD";

export interface ChallengesInitialData {
  challenges: Challenge[];
  hasMore: boolean;
  userElo: number;
  initialError: string | null;
}

export interface ChallengesState {
  challenges: Challenge[];
  loadingInitial: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  userElo: number;
  filterDifficulty: DifficultyFilter;
  searchQuery: string;
  initialError: string | null;
}

export type ChallengesAction =
  | { type: "reloadStarted" }
  | {
      type: "reloadSucceeded";
      payload: { challenges: Challenge[]; hasMore: boolean; userElo: number };
    }
  | { type: "reloadFailed"; payload: string }
  | { type: "loadingMore"; payload: boolean }
  | { type: "appendLoaded"; payload: { challenges: Challenge[]; hasMore: boolean } }
  | { type: "setFilter"; payload: DifficultyFilter }
  | { type: "setSearch"; payload: string }
  | { type: "clearFilters" };

export interface ChallengeRow {
  type: "single" | "pair";
  items: Challenge[];
}

export function createInitialChallengesState(initialData: ChallengesInitialData): ChallengesState {
  return {
    challenges: initialData.challenges,
    loadingInitial: false,
    loadingMore: false,
    hasMore: initialData.hasMore,
    userElo: initialData.userElo || DEFAULT_USER_ELO,
    filterDifficulty: "ALL",
    searchQuery: "",
    initialError: initialData.initialError,
  };
}

export function challengesReducer(
  state: ChallengesState,
  action: ChallengesAction,
): ChallengesState {
  switch (action.type) {
    case "reloadStarted":
      return {
        ...state,
        loadingInitial: true,
        initialError: null,
      };
    case "reloadSucceeded":
      return {
        ...state,
        challenges: action.payload.challenges,
        hasMore: action.payload.hasMore,
        userElo: action.payload.userElo,
        loadingInitial: false,
        initialError: null,
      };
    case "reloadFailed":
      return {
        ...state,
        challenges: [],
        hasMore: false,
        loadingInitial: false,
        initialError: action.payload,
      };
    case "loadingMore":
      return {
        ...state,
        loadingMore: action.payload,
      };
    case "appendLoaded":
      return {
        ...state,
        challenges: [...state.challenges, ...action.payload.challenges],
        hasMore: action.payload.hasMore,
      };
    case "setFilter":
      return {
        ...state,
        filterDifficulty: action.payload,
      };
    case "setSearch":
      return {
        ...state,
        searchQuery: action.payload,
      };
    case "clearFilters":
      return {
        ...state,
        filterDifficulty: "ALL",
        searchQuery: "",
      };
    default:
      return state;
  }
}

export function matchesChallenge(
  challenge: Challenge,
  searchQuery: string,
  filterDifficulty: DifficultyFilter,
) {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const matchesSearch =
    normalizedQuery.length === 0 ||
    challenge.title.toLocaleLowerCase().includes(normalizedQuery) ||
    challenge.tags.toLocaleLowerCase().includes(normalizedQuery);

  const matchesDifficulty =
    filterDifficulty === "ALL" || challenge.difficulty === filterDifficulty;

  return matchesSearch && matchesDifficulty;
}

export function getVisibleChallenges(
  challenges: Challenge[],
  searchQuery: string,
  filterDifficulty: DifficultyFilter,
) {
  return challenges.filter(challenge => matchesChallenge(challenge, searchQuery, filterDifficulty));
}

export function resolveActiveChallengeId(
  visibleChallenges: Challenge[],
  currentActiveChallengeId: string | null,
) {
  if (visibleChallenges.length === 0) {
    return null;
  }

  if (currentActiveChallengeId) {
    const stillVisible = visibleChallenges.some(challenge => challenge.id === currentActiveChallengeId);
    if (stillVisible) {
      return currentActiveChallengeId;
    }
  }

  return visibleChallenges[0]!.id;
}

export function getActiveChallengeNavigation(
  visibleChallenges: Challenge[],
  activeChallengeId: string | null,
) {
  if (visibleChallenges.length === 0 || !activeChallengeId) {
    return {
      activeIndex: -1,
      total: visibleChallenges.length,
      previousChallengeId: null,
      nextChallengeId: null,
    };
  }

  const activeIndex = visibleChallenges.findIndex(challenge => challenge.id === activeChallengeId);
  if (activeIndex === -1) {
    return {
      activeIndex: -1,
      total: visibleChallenges.length,
      previousChallengeId: null,
      nextChallengeId: null,
    };
  }

  return {
    activeIndex,
    total: visibleChallenges.length,
    previousChallengeId: visibleChallenges[activeIndex - 1]?.id ?? null,
    nextChallengeId: visibleChallenges[activeIndex + 1]?.id ?? null,
  };
}

export function buildChallengeRows(challenges: Challenge[]): ChallengeRow[] {
  const sortedChallenges = challenges.toSorted(
    (left, right) => left.recommendedElo - right.recommendedElo,
  );
  const rows: ChallengeRow[] = [];

  let groupIndex = 0;
  while (groupIndex < sortedChallenges.length) {
    const current = sortedChallenges[groupIndex];
    const next = sortedChallenges[groupIndex + 1];

    if (
      next &&
      current.difficulty === next.difficulty &&
      Math.abs(current.recommendedElo - next.recommendedElo) <= 100
    ) {
      rows.push({ type: "pair", items: [current, next] });
      groupIndex += 2;
      continue;
    }

    rows.push({ type: "single", items: [current] });
    groupIndex += 1;
  }

  return rows;
}
