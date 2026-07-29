export const RECENT_ATTEMPT_WINDOW_MS = 72 * 60 * 60 * 1000;

type FeaturedAttempt = {
  score: number;
  sessionStatus: "RETRY_AVAILABLE" | "SOLVED" | "ELO_EXHAUSTED" | "REVEALED";
  createdAt: Date | string;
};

export type FeaturedChallengeCandidate = {
  id: string;
  difficulty: string;
  recommendedElo: number;
  uniquePractitionerCount: number;
  attempts: FeaturedAttempt[];
};

type FeaturedChallengeReason =
  | "CONTINUE_RECENT"
  | "PERSONALIZED"
  | "POPULAR_BEGINNER"
  | "FALLBACK";

type SelectFeaturedChallengeInput<T extends FeaturedChallengeCandidate> = {
  challenges: T[];
  userElo?: number;
  now: Date;
};

export function selectFeaturedChallenge<T extends FeaturedChallengeCandidate>({
  challenges,
  userElo,
  now,
}: SelectFeaturedChallengeInput<T>): {
  challenge: T | null;
  reason: FeaturedChallengeReason;
} {
  if (userElo !== undefined) {
    let recentInProgress: T | undefined;
    let latestAttemptTime = Number.NEGATIVE_INFINITY;

    for (const challenge of challenges) {
      const attempt = challenge.attempts[0];
      if (attempt?.sessionStatus !== "RETRY_AVAILABLE") {
        continue;
      }

      const attemptTime = new Date(attempt.createdAt).getTime();
      const isRecent =
        now.getTime() - attemptTime <= RECENT_ATTEMPT_WINDOW_MS;
      if (isRecent && attemptTime > latestAttemptTime) {
        recentInProgress = challenge;
        latestAttemptTime = attemptTime;
      }
    }

    if (recentInProgress) {
      return { challenge: recentInProgress, reason: "CONTINUE_RECENT" };
    }

    const unattemptedChallenges = challenges.filter(
      (challenge) => challenge.attempts.length === 0,
    );
    const personalizedPool = unattemptedChallenges.length > 0
      ? unattemptedChallenges
      : challenges;
    const personalized = personalizedPool
      .toSorted((left, right) =>
        Math.abs(left.recommendedElo - userElo) -
        Math.abs(right.recommendedElo - userElo)
      )[0];

    if (personalized) {
      return { challenge: personalized, reason: "PERSONALIZED" };
    }
  }

  const popularBeginner = challenges
    .filter((challenge) => challenge.difficulty === "EASY")
    .sort((left, right) =>
      right.uniquePractitionerCount - left.uniquePractitionerCount ||
      left.recommendedElo - right.recommendedElo
    )[0];

  if (popularBeginner) {
    return { challenge: popularBeginner, reason: "POPULAR_BEGINNER" };
  }

  return {
    challenge: challenges[0] ?? null,
    reason: "FALLBACK",
  };
}
