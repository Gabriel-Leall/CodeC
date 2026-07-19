type DateLikeRecord = {
  createdAt: Date;
  updatedAt?: Date;
};

type UserRecord = DateLikeRecord & {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  bio: string | null;
  image: string | null;
  elo: number;
  updatedAt: Date;
};

type AttemptRecord = {
  id: string;
  userId: string;
  challengeId: string;
  userAnswer: string;
  feedbackJson: string;
  score: number;
  eloChange: number;
  createdAt: Date;
  challenge?: ChallengeRecord;
};

type ChallengeRecord = DateLikeRecord & {
  id: string;
  title: string;
  difficulty: string;
  recommendedElo: number;
  code: string;
  question: string;
  solution: string;
  tags: string;
  updatedAt: Date;
  attempts?: Array<Pick<AttemptRecord, "id" | "score" | "eloChange" | "createdAt">>;
};

export function serializeUser(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    bio: user.bio,
    image: user.image,
    elo: user.elo,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function serializeChallengeSummary(challenge: ChallengeRecord) {
  return {
    id: challenge.id,
    title: challenge.title,
    difficulty: challenge.difficulty,
    recommendedElo: challenge.recommendedElo,
    tags: challenge.tags,
    createdAt: challenge.createdAt.toISOString(),
    updatedAt: challenge.updatedAt.toISOString(),
    attempts: (challenge.attempts ?? []).map((attempt) => ({
      id: attempt.id,
      score: attempt.score,
      eloChange: attempt.eloChange,
      createdAt: attempt.createdAt.toISOString(),
    })),
  };
}

export function serializeChallengeDetail(challenge: ChallengeRecord) {
  return {
    ...serializeChallengeSummary(challenge),
    code: challenge.code,
    question: challenge.question,
  };
}

export function serializeAttempt(attempt: AttemptRecord) {
  return {
    id: attempt.id,
    userId: attempt.userId,
    challengeId: attempt.challengeId,
    userAnswer: attempt.userAnswer,
    feedbackJson: attempt.feedbackJson,
    score: attempt.score,
    eloChange: attempt.eloChange,
    createdAt: attempt.createdAt.toISOString(),
    ...(attempt.challenge
      ? {
          challenge: {
            id: attempt.challenge.id,
            title: attempt.challenge.title,
            difficulty: attempt.challenge.difficulty,
            recommendedElo: attempt.challenge.recommendedElo,
            tags: attempt.challenge.tags,
            createdAt: attempt.challenge.createdAt.toISOString(),
            updatedAt: attempt.challenge.updatedAt.toISOString(),
          },
        }
      : {}),
  };
}
