import { PASSING_ATTEMPT_SCORE } from "./attempt-session-rules";

type ProgressAttempt = {
  score: number;
  eloChange: number;
  createdAt: Date;
  challenge: { id: string; difficulty: string };
};

export function buildPractitionerProgress<T extends ProgressAttempt>(
  attempts: readonly T[],
  now: Date,
) {
  const resolvedChallengeIds = new Set<string>();
  let passedAttempts = 0;
  for (const attempt of attempts) {
    if (attempt.score < PASSING_ATTEMPT_SCORE) continue;
    passedAttempts += 1;
    resolvedChallengeIds.add(attempt.challenge.id);
  }
  const firstAttempts = getFirstAttemptsByChallenge(attempts);

  return {
    attemptsCount: attempts.length,
    resolvedCount: resolvedChallengeIds.size,
    accuracy: attempts.length
      ? Math.round((passedAttempts / attempts.length) * 100)
      : 0,
    streak: getCurrentStudyStreak(attempts, now),
    studyHours: estimateStudyHours(attempts),
    firstAttempts,
  };
}

function getFirstAttemptsByChallenge<T extends ProgressAttempt>(attempts: readonly T[]) {
  const seen = new Set<string>();
  return attempts
    .toSorted((left, right) => left.createdAt.getTime() - right.createdAt.getTime())
    .filter((attempt) => {
      if (seen.has(attempt.challenge.id)) return false;
      seen.add(attempt.challenge.id);
      return true;
    });
}

function getCurrentStudyStreak(attempts: ReadonlyArray<Pick<ProgressAttempt, "createdAt">>, now: Date) {
  const attemptedDays = new Set(attempts.map((attempt) => toDateKey(attempt.createdAt)));
  let cursor = startOfDay(now);
  let streak = 0;

  if (!attemptedDays.has(toDateKey(cursor))) cursor = addDays(cursor, -1);
  while (attemptedDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function estimateStudyHours(attempts: readonly ProgressAttempt[]) {
  const minutes = attempts.reduce((total, attempt) => {
    if (attempt.challenge.difficulty === "HARD") return total + 18;
    if (attempt.challenge.difficulty === "MEDIUM") return total + 12;
    return total + 8;
  }, 0);
  return minutes === 0 ? 0 : Math.max(1, Math.round(minutes / 60));
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}
