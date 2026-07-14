import "server-only";

import { isMockMode } from "@/lib/mock-mode";
import { mockTrainingStore } from "@/server/api/mock-store";

export async function loadProfileData() {
  if (isMockMode()) {
    const user = mockTrainingStore.getCurrentUser();
    const attempts = mockTrainingStore.listAttempts();
    const attemptedChallengeIds = new Set(attempts.map((attempt) => attempt.challengeId));
    const recommendations = mockTrainingStore
      .listChallenges({ limit: 5, offset: 0 })
      .items.filter((challenge) => !attemptedChallengeIds.has(challenge.id));

    return { user, attempts, recommendations };
  }

  const [{ default: prisma }, { ensureDefaultLocalUser }] = await Promise.all([
    import("@kodan/db"),
    import("@/lib/local-user"),
  ]);
  const user = await ensureDefaultLocalUser();
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
