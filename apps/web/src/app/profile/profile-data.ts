import type {
  AchievementItem,
  EloPoint,
  ProfileDifficulty,
  ProfileSessionStatus,
  ProfileViewModel,
  RecommendedChallengeItem,
  TopicMasteryItem,
} from "./profile-types";

const INITIAL_ELO = 1200;
const PT_BR_INTEGER = new Intl.NumberFormat("pt-BR");
const PT_BR_PERCENT = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});
const PT_BR_SHORT_DATE = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});
const PT_BR_MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

type ProfileUserRecord = {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
  elo: number;
  createdAt: Date;
};

type ProfileChallengeRecord = {
  id: string;
  title: string;
  difficulty: string;
  recommendedElo: number;
  tags: string;
};

type ProfileAttemptRecord = {
  id: string;
  score: number;
  eloChange: number;
  createdAt: Date;
  challenge: ProfileChallengeRecord;
};

export type ProfileViewModelInput = {
  user: ProfileUserRecord;
  attempts: ProfileAttemptRecord[];
  recommendations: ProfileChallengeRecord[];
  now?: Date;
};

export function clampProficiency(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getProfileRankLabel(elo: number) {
  if (elo >= 1850) {
    return "SENSEI";
  }

  if (elo >= 1550) {
    return "RONIN";
  }

  return "KYU";
}

export function buildProfileViewModel({
  user,
  attempts,
  recommendations,
  now = new Date(),
}: ProfileViewModelInput): ProfileViewModel {
  const uniqueResolvedChallengeIds = new Set(
    attempts
      .filter((attempt) => attempt.score >= 5)
      .map((attempt) => attempt.challenge.id),
  );
  const firstAttempts = getFirstAttemptsByChallenge(attempts);
  const accuracy = attempts.length
    ? Math.round(
        (attempts.filter((attempt) => attempt.score >= 5).length /
          attempts.length) *
          100,
      )
    : 0;

  return {
    user: {
      id: user.id,
      name: user.name,
      bio: user.bio ?? "Código com clareza. Diagnose com precisão. Ascenda.",
      image: user.image,
      planLabel: "LOCAL",
      tagline: user.bio ?? "Código com clareza. Diagnose com precisão. Ascenda.",
      memberSinceLabel: `Membro desde ${formatMonthYear(user.createdAt)}`,
      countryLabel: "Brasil",
      timezoneLabel: "Fuso horário: BRT",
      rank: getProfileRankLabel(user.elo),
      elo: user.elo,
      topPercentLabel: getTopPercentLabel(user.elo),
    },
    stats: [
      {
        id: "resolved",
        label: "Desafios resolvidos",
        value: PT_BR_INTEGER.format(uniqueResolvedChallengeIds.size),
      },
      {
        id: "streak",
        label: "Sequência atual",
        value: `${getCurrentStudyStreak(attempts, now)} dias`,
        accent: "warning",
      },
      {
        id: "accuracy",
        label: "Taxa de acerto",
        value: `${PT_BR_PERCENT.format(accuracy)}%`,
      },
      {
        id: "study-hours",
        label: "Horas de estudo",
        value: `${estimateStudyHours(attempts)} h`,
      },
      {
        id: "attempts",
        label: "Tentativas de desafios",
        value: PT_BR_INTEGER.format(attempts.length),
      },
    ],
    eloSeries: buildEloSeries(firstAttempts, user.elo),
    topicMastery: buildTopicMastery(attempts),
    recentSessions: attempts.slice(0, 5).map((attempt) => ({
      id: attempt.id,
      dateLabel: formatSessionDate(attempt.createdAt),
      challenge: attempt.challenge.title,
      difficulty: normalizeDifficulty(attempt.challenge.difficulty),
      result: getSessionStatus(attempt),
      eloChange: attempt.eloChange,
    })),
    recommendations: recommendations.slice(0, 5).map((challenge) => ({
      id: challenge.id,
      challenge: challenge.title,
      topic: getPrimaryTopicLabel(challenge),
      difficulty: normalizeDifficulty(challenge.difficulty),
      possibleElo: getPossibleElo(challenge.difficulty),
    })),
    achievements: buildAchievements({
      attempts,
      resolvedCount: uniqueResolvedChallengeIds.size,
      streak: getCurrentStudyStreak(attempts, now),
    }),
  };
}

function getFirstAttemptsByChallenge(attempts: ProfileAttemptRecord[]) {
  const chronological = [...attempts].sort(
    (left, right) => left.createdAt.getTime() - right.createdAt.getTime(),
  );
  const seen = new Set<string>();

  return chronological.filter((attempt) => {
    if (seen.has(attempt.challenge.id)) {
      return false;
    }

    seen.add(attempt.challenge.id);
    return true;
  });
}

function buildEloSeries(
  firstAttempts: ProfileAttemptRecord[],
  currentElo: number,
): EloPoint[] {
  if (firstAttempts.length === 0) {
    return [{ dateLabel: "Hoje", elo: currentElo }];
  }

  const totalDelta = firstAttempts.reduce(
    (sum, attempt) => sum + attempt.eloChange,
    0,
  );
  let runningElo = Math.max(100, currentElo - totalDelta);

  return firstAttempts.slice(-13).map((attempt) => {
    runningElo = Math.max(100, runningElo + attempt.eloChange);
    return {
      dateLabel: formatShortDate(attempt.createdAt),
      elo: runningElo,
    };
  });
}

function buildTopicMastery(attempts: ProfileAttemptRecord[]): TopicMasteryItem[] {
  const topicStats = new Map<string, { label: string; attempts: number; score: number }>();

  for (const attempt of attempts) {
    const topic = getPrimaryTopic(attempt.challenge);
    const current = topicStats.get(topic.id) ?? {
      label: topic.label,
      attempts: 0,
      score: 0,
    };
    topicStats.set(topic.id, {
      label: current.label,
      attempts: current.attempts + 1,
      score: current.score + attempt.score,
    });
  }

  const mastered = [...topicStats.entries()]
    .map(([topicId, stats]) => ({
      topicId,
      label: stats.label,
      proficiency: clampProficiency((stats.score / (stats.attempts * 10)) * 100),
    }))
    .sort((left, right) => right.proficiency - left.proficiency)
    .slice(0, 5);

  if (mastered.length > 0) {
    return mastered;
  }

  return [
    "Effects & Lifecycle",
    "State & Rendering",
    "Async UI & Races",
    "Forms & Validation",
    "Component Patterns",
  ].map((label, index) => ({
    topicId: label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-"),
    label,
    proficiency: 0,
  }));
}

function buildAchievements({
  attempts,
  resolvedCount,
  streak,
}: {
  attempts: ProfileAttemptRecord[];
  resolvedCount: number;
  streak: number;
}): AchievementItem[] {
  const latestAttemptDate = attempts[0]?.createdAt ?? new Date();
  const hardResolvedCount = attempts.filter(
    (attempt) => attempt.score >= 5 && attempt.challenge.difficulty === "HARD",
  ).length;
  const effectsResolvedCount = attempts.filter(
    (attempt) =>
      attempt.score >= 5 &&
      getPrimaryTopic(attempt.challenge).id === "effects-lifecycle",
  ).length;

  return [
    {
      id: "focus",
      title: "Foco Sustentado",
      description: `Sequência atual de ${streak} dias`,
      unlockedAtLabel: getAchievementDateLabel(latestAttemptDate),
      tone: "blue",
    },
    {
      id: "diagnostic",
      title: "Diagnóstico Afiado",
      description: `${resolvedCount} desafios resolvidos`,
      unlockedAtLabel: getAchievementDateLabel(latestAttemptDate),
      tone: "green",
    },
    {
      id: "advanced",
      title: "React Avançado",
      description: `${hardResolvedCount} desafios difíceis resolvidos`,
      unlockedAtLabel: getAchievementDateLabel(latestAttemptDate),
      tone: "orange",
    },
    {
      id: "effects",
      title: "Mestre em Effects",
      description: `${effectsResolvedCount} desafios de Effects resolvidos`,
      unlockedAtLabel: getAchievementDateLabel(latestAttemptDate),
      tone: "indigo",
    },
  ];
}

function getSessionStatus(attempt: ProfileAttemptRecord): ProfileSessionStatus {
  if (attempt.score >= 5) {
    return "resolved";
  }

  return "in_progress";
}

function getCurrentStudyStreak(attempts: ProfileAttemptRecord[], now: Date) {
  const attemptedDays = new Set(
    attempts.map((attempt) => toDateKey(attempt.createdAt)),
  );
  let cursor = startOfDay(now);
  let streak = 0;

  if (!attemptedDays.has(toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  while (attemptedDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function estimateStudyHours(attempts: ProfileAttemptRecord[]) {
  const minutes = attempts.reduce((total, attempt) => {
    if (attempt.challenge.difficulty === "HARD") {
      return total + 18;
    }

    if (attempt.challenge.difficulty === "MEDIUM") {
      return total + 12;
    }

    return total + 8;
  }, 0);

  if (minutes === 0) {
    return 0;
  }

  return Math.max(1, Math.round(minutes / 60));
}

function getPossibleElo(difficulty: string) {
  if (difficulty === "HARD") {
    return 22;
  }

  if (difficulty === "EASY") {
    return 12;
  }

  return 18;
}

function normalizeDifficulty(difficulty: string): ProfileDifficulty {
  if (difficulty === "EASY" || difficulty === "MEDIUM" || difficulty === "HARD") {
    return difficulty;
  }

  return "MEDIUM";
}

function getPrimaryTopicLabel(challenge: ProfileChallengeRecord) {
  return getPrimaryTopic(challenge).label;
}

function getPrimaryTopic(challenge: ProfileChallengeRecord) {
  const haystack = `${challenge.title},${challenge.tags}`.toLowerCase();

  if (haystack.includes("effect") || haystack.includes("hook")) {
    return { id: "effects-lifecycle", label: "Effects & Lifecycle" };
  }

  if (
    haystack.includes("async") ||
    haystack.includes("race") ||
    haystack.includes("fetch") ||
    haystack.includes("promise")
  ) {
    return { id: "async-races", label: "Async UI & Races" };
  }

  if (
    haystack.includes("form") ||
    haystack.includes("valid") ||
    haystack.includes("input")
  ) {
    return { id: "forms-validation", label: "Forms & Validation" };
  }

  if (
    haystack.includes("component") ||
    haystack.includes("composition") ||
    haystack.includes("children")
  ) {
    return { id: "component-patterns", label: "Component Patterns" };
  }

  if (
    haystack.includes("type") ||
    haystack.includes("generic") ||
    haystack.includes("typescript")
  ) {
    return { id: "type-system", label: "Type System" };
  }

  return { id: "state-rendering", label: "State & Rendering" };
}

function getTopPercentLabel(elo: number) {
  if (elo >= 1850) {
    return "Top 5%";
  }

  if (elo >= 1550) {
    return "Top 12%";
  }

  if (elo >= 1300) {
    return "Top 35%";
  }

  return "Em evolução";
}

function getAchievementDateLabel(date: Date) {
  return `Atualizado em ${formatShortDate(date)}`;
}

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatShortDate(date: Date) {
  return PT_BR_SHORT_DATE.format(date).replace(".", "");
}

function formatSessionDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${PT_BR_MONTHS[date.getMonth()]}, ${date.getFullYear()}`;
}

function toDateKey(date: Date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
