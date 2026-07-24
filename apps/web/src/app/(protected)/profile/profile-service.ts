import "server-only";

import { isMockMode } from "@/lib/mock-mode";
import { mockTrainingStore } from "@/server/api/mock-store";

export async function loadProfileData(userId?: string) {
  if (isMockMode()) {
    const user = mockTrainingStore.getCurrentUser();
    const attempts = mockTrainingStore.listAttempts();
    const attemptedChallengeIds = new Set(attempts.map((attempt) => attempt.challengeId));
    const recommendations = mockTrainingStore
      .listChallenges({ limit: 5, offset: 0 })
      .items.filter((challenge) => !attemptedChallengeIds.has(challenge.id));

    return { user, attempts, recommendations };
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { default: prisma } = await import("@kodan/db");
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id },
    include: { challenge: true },
    orderBy: { createdAt: "desc" },
  });
  const attemptedChallengeIds = new Set(attempts.map((attempt) => attempt.challengeId));
  const recommendations = await prisma.challenge.findMany({
    where:
      attemptedChallengeIds.size > 0
        ? { id: { notIn: [...attemptedChallengeIds] } }
        : undefined,
    orderBy: [{ recommendedElo: "asc" }, { createdAt: "desc" }],
    take: 5,
  });

  return { user, attempts, recommendations };
}
